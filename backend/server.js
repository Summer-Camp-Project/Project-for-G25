const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL,
    /\.netlify\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['visitor', 'admin', 'super_admin', 'museum_curator', 'tour_organizer', 'education_coordinator'], 
    default: 'visitor' 
  },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
});

const User = mongoose.model('User', userSchema);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'EthioHeritage360 server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============ AI-POWERED ROUTES ============

// Intelligent Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ success: false, message: 'OpenAI API key not configured' });
    }

    // Detect query type for intelligent responses
    const lowerMessage = message.toLowerCase();
    const platformKeywords = {
      welcome: ['welcome', 'hello', 'hi', 'start', 'begin'],
      help: ['help', 'support', 'assistance', 'guide'],
      contact: ['contact', 'reach', 'support team', 'admin'],
      education: ['education', 'learn', 'study', 'school', 'university'],
      museum: ['museum', 'virtual museum', 'exhibits', 'collections'],
      tour: ['tour', 'visit', 'travel', 'trip', 'guide'],
      features: ['features', 'what can', 'capabilities', 'functions'],
      ecosystem: ['ecosystem', 'platform', 'system', 'about']
    };

    let queryType = 'general';
    for (const [type, keywords] of Object.entries(platformKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        queryType = type;
        break;
      }
    }

    // Create context-aware system prompt
    let systemPrompt = `You are the AI assistant for EthioHeritage360, a comprehensive Ethiopian heritage ecosystem platform. You are knowledgeable, helpful, and enthusiastic about Ethiopian culture and heritage.`;

    switch (queryType) {
      case 'welcome':
        systemPrompt += ` Welcome users warmly to EthioHeritage360. Explain this is a complete ecosystem with Virtual Museum, Educational resources, Community features, Expert guides, Tour planning, Cultural events, and Research tools.`;
        break;
      case 'help':
        systemPrompt += ` Provide help about platform features: AI Chat Assistant (24/7), Super Admin for technical issues, Museum Curators for exhibits, Tour Organizers for travel, Educational Coordinators for learning, Community Moderators for interactions.`;
        break;
      case 'contact':
        systemPrompt += ` Provide contact info: Super Admin (technical issues), Museum Director (exhibits), Education Coordinator (learning), Tour Manager (travel), Community Manager (interactions), Cultural Expert (heritage questions).`;
        break;
      case 'education':
        systemPrompt += ` Focus on educational features: Interactive learning modules, Virtual field trips, Educational games, Research databases, Teacher resources, Student tools, Certification programs, University partnerships.`;
        break;
      case 'museum':
        systemPrompt += ` Explain virtual museum: 3D interactive exhibits, Historical timelines, Audio-visual storytelling, Artifact collections, VR heritage tours, Interactive maps, Curator presentations, Digital preservation.`;
        break;
      case 'tour':
        systemPrompt += ` Describe tour features: AI-powered itinerary creation, Local guide connections, Heritage site recommendations, Cultural event calendar, Transportation coordination, Safety tips, Group management.`;
        break;
      case 'features':
        systemPrompt += ` List all features: 🏛️ Virtual Museum, 📚 Education Hub, 🗺️ Tour Planner, 👥 Community, 🔍 Research, 📱 Mobile Access, 🎯 Personalization, 🌐 Multilingual support.`;
        break;
      case 'ecosystem':
        systemPrompt += ` Explain the ecosystem: Digital Heritage Preservation, Educational Development, Community Engagement, Tourism Development, Research Collaboration - all interconnected for comprehensive heritage experience.`;
        break;
      default:
        systemPrompt += ` Provide expert knowledge about Ethiopian heritage, culture, and history. Always relate back to platform features. ${context ? `Context: ${context}` : ''}`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 800,
      temperature: 0.7
    });

    const response = completion.choices[0]?.message?.content;
    
    res.json({
      success: true,
      data: {
        message: response,
        query_type: queryType,
        usage: completion.usage
      }
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing chat request',
      error: error.message
    });
  }
});

// Heritage Information Endpoint
app.post('/api/heritage-info', async (req, res) => {
  try {
    const { site, query } = req.body;
    
    if (!site && !query) {
      return res.status(400).json({ success: false, message: 'Site name or query required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ success: false, message: 'OpenAI API key not configured' });
    }

    const prompt = site 
      ? `Tell me about the Ethiopian heritage site: ${site}. Include historical significance, cultural importance, and visitor information.`
      : query;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert on Ethiopian history, culture, and heritage sites. Provide accurate, detailed information about Ethiopian historical sites, cultural practices, and traditions."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 600,
      temperature: 0.5
    });

    res.json({
      success: true,
      data: {
        site: site || 'General Query',
        information: completion.choices[0]?.message?.content,
        usage: completion.usage
      }
    });
  } catch (error) {
    console.error('Heritage Info Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching heritage information' });
  }
});

// Tour Suggestions Endpoint
app.post('/api/tour-suggestions', async (req, res) => {
  try {
    const { interests, duration, location } = req.body;
    
    if (!interests) {
      return res.status(400).json({ success: false, message: 'Interests required for tour suggestions' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ success: false, message: 'OpenAI API key not configured' });
    }

    const prompt = `Create a personalized Ethiopian heritage tour based on:
    - Interests: ${interests}
    - Duration: ${duration || 'flexible'}
    - Starting location: ${location || 'flexible'}
    
    Provide detailed itinerary with sites, experiences, and practical tips.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert Ethiopian tour guide. Create personalized tour recommendations showcasing Ethiopia's diverse heritage with specific locations, timing, and practical advice."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.6
    });

    res.json({
      success: true,
      data: {
        suggestions: completion.choices[0]?.message?.content,
        parameters: { interests, duration, location },
        usage: completion.usage
      }
    });
  } catch (error) {
    console.error('Tour Suggestions Error:', error);
    res.status(500).json({ success: false, message: 'Error generating tour suggestions' });
  }
});

// Cultural Context Endpoint
app.post('/api/cultural-context', async (req, res) => {
  try {
    const { text, context_type } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text required for cultural context' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ success: false, message: 'OpenAI API key not configured' });
    }

    let systemPrompt = "You are an expert on Ethiopian culture, languages, and traditions.";
    
    switch (context_type) {
      case 'translation':
        systemPrompt += " Help translate and explain Ethiopian terms with cultural significance.";
        break;
      case 'tradition':
        systemPrompt += " Explain Ethiopian cultural traditions and historical background.";
        break;
      case 'etiquette':
        systemPrompt += " Provide cultural etiquette guidance for heritage sites and communities.";
        break;
      default:
        systemPrompt += " Provide cultural context about Ethiopian heritage and customs.";
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text }
      ],
      max_tokens: 500,
      temperature: 0.4
    });

    res.json({
      success: true,
      data: {
        context: completion.choices[0]?.message?.content,
        type: context_type || 'general',
        usage: completion.usage
      }
    });
  } catch (error) {
    console.error('Cultural Context Error:', error);
    res.status(500).json({ success: false, message: 'Error providing cultural context' });
  }
});

// Platform Information Endpoint
app.get('/api/platform/info', (req, res) => {
  res.json({
    success: true,
    data: {
      platform_name: 'EthioHeritage360',
      description: 'Comprehensive Ethiopian Heritage Ecosystem',
      version: '2.0.0',
      features: {
        virtual_museum: {
          name: '🏛️ Virtual Museum',
          description: '3D interactive exhibits and artifact collections'
        },
        education_hub: {
          name: '📚 Education Hub', 
          description: 'Learning resources and programs'
        },
        tour_planner: {
          name: '🗺️ AI Tour Planner',
          description: 'Intelligent travel planning system'
        },
        community_platform: {
          name: '👥 Community Hub',
          description: 'Cultural discussions and connections'
        },
        research_center: {
          name: '🔍 Research Center',
          description: 'Academic databases and resources'
        }
      },
      contact_info: {
        general: 'info@ethioheritage360.com',
        support: 'support@ethioheritage360.com',
        education: 'education@ethioheritage360.com',
        tours: 'tours@ethioheritage360.com'
      }
    }
  });
});

// Help Endpoint
app.get('/api/help', (req, res) => {
  res.json({
    success: true,
    data: {
      platform_name: 'EthioHeritage360',
      welcome_message: 'Welcome to EthioHeritage360 - Your Gateway to Ethiopian Heritage!',
      quick_help: {
        getting_started: [
          'Explore virtual museum exhibits',
          'Try the AI chat assistant',
          'Browse heritage site information',
          'Plan tours with AI recommendations'
        ],
        support_channels: {
          ai_assistant: 'Available 24/7 for instant help',
          technical_support: 'support@ethioheritage360.com',
          educational_support: 'education@ethioheritage360.com',
          tour_assistance: 'tours@ethioheritage360.com'
        }
      }
    }
  });
});

// OpenAI Status Check
app.get('/api/openai/status', async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        success: true,
        status: 'not_configured',
        message: 'OpenAI API key not configured'
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 5
    });

    res.json({
      success: true,
      status: 'active',
      message: 'OpenAI API working correctly',
      model: 'gpt-3.5-turbo'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'OpenAI API configuration issue',
      error: error.message
    });
  }
});

// ============ AUTHENTICATION ROUTES ============

// JWT token generation
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'ethioheritage360_secret_key', {
    expiresIn: '7d'
  });
};

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || 'visitor'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Error registering user', error: error.message });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ success: false, message: 'Account is deactivated. Please contact support.' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Error during login', error: error.message });
  }
});

// Get current user profile
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ethioheritage360_secret_key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Create default admin users if they don't exist
const createDefaultUsers = async () => {
  try {
    const adminEmail = 'melkamuwako5@admin.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const adminUser = new User({
        name: 'Super Admin',
        email: adminEmail,
        password: 'admin123', // Change this password!
        role: 'super_admin'
      });
      await adminUser.save();
      console.log('✅ Default super admin created:', adminEmail);
    }

    // Create tour organizer
    const tourEmail = 'organizer@heritagetours.et';
    const existingTourOrganizer = await User.findOne({ email: tourEmail });
    
    if (!existingTourOrganizer) {
      const tourUser = new User({
        name: 'Heritage Tour Organizer',
        email: tourEmail,
        password: 'tour123', // Change this password!
        role: 'tour_organizer'
      });
      await tourUser.save();
      console.log('✅ Default tour organizer created:', tourEmail);
    }
  } catch (error) {
    console.error('Error creating default users:', error);
  }
};

// User CRUD routes (existing)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email required' });
    }
    const user = new User({ name, email });
    const savedUser = await user.save();
    res.status(201).json({ success: true, data: savedUser });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: 'Error creating user' });
  }
});

// Catch-all route
app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Start server
const startServer = async () => {
  await connectDB();
  
  // Create default users after DB connection
  await createDefaultUsers();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 EthioHeritage360 AI Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down server...');
  await mongoose.connection.close();
  process.exit(0);
});
