// Fix Production Users - Create default admin accounts
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Use the production MongoDB URI directly
const PRODUCTION_MONGODB_URI = 'mongodb+srv://melkamuwako5_db_user:YFweyhElTJBj5sXp@cluster0.x3jfm8p.mongodb.net/ethioheritage360?retryWrites=true&w=majority&appName=Cluster0';

// User Schema (exact same as server.js)
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
};

const User = mongoose.model('User', userSchema);

async function fixProductionUsers() {
  try {
    console.log('🔄 Connecting to production MongoDB Atlas...');
    console.log('Database: ethioheritage360');
    
    await mongoose.connect(PRODUCTION_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to production database');

    // Check existing users first
    console.log('\n📋 Checking existing users...');
    const existingUsers = await User.find({}, 'name email role isActive');
    console.log(`Found ${existingUsers.length} existing users:`);
    
    if (existingUsers.length > 0) {
      existingUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - Active: ${user.isActive}`);
      });
    } else {
      console.log('No existing users found - this explains the login failures!');
    }

    // Default users to create
    const defaultUsers = [
      {
        name: 'Super Admin',
        email: 'melkamuwako5@admin.com',
        password: 'admin123',
        role: 'super_admin',
        isActive: true
      },
      {
        name: 'Museum Administrator',
        email: 'museum.admin@ethioheritage360.com',
        password: 'museum123',
        role: 'admin',
        isActive: true
      },
      {
        name: 'Heritage Tour Organizer',
        email: 'organizer@heritagetours.et',
        password: 'tour123',
        role: 'tour_organizer',
        isActive: true
      }
    ];

    console.log('\n👥 Creating default admin users...');

    for (const defaultUser of defaultUsers) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: defaultUser.email });
        
        if (existingUser) {
          console.log(`✅ User already exists: ${defaultUser.email}`);
          
          // Update password to ensure it works
          console.log(`🔧 Updating password for: ${defaultUser.email}`);
          existingUser.password = defaultUser.password;
          existingUser.isActive = true;
          await existingUser.save();
          console.log(`✅ Password updated for: ${defaultUser.email}`);
          
        } else {
          // Create new user
          const newUser = new User(defaultUser);
          await newUser.save();
          console.log(`✅ Created new user: ${defaultUser.email}`);
        }
      } catch (userError) {
        console.error(`❌ Error processing user ${defaultUser.email}:`, userError.message);
      }
    }

    // Verify all users were created successfully
    console.log('\n🔍 Verification - Testing passwords...');
    
    for (const testUser of defaultUsers) {
      try {
        const user = await User.findOne({ email: testUser.email });
        if (user) {
          const isPasswordValid = await user.comparePassword(testUser.password);
          console.log(`${testUser.email}: Password test ${isPasswordValid ? '✅ PASS' : '❌ FAIL'}`);
        } else {
          console.log(`${testUser.email}: ❌ USER NOT FOUND`);
        }
      } catch (testError) {
        console.error(`❌ Error testing ${testUser.email}:`, testError.message);
      }
    }

    console.log('\n🎉 PRODUCTION USER FIX COMPLETE!');
    console.log('\n📋 LOGIN CREDENTIALS FOR YOUR APP:');
    console.log('=' .repeat(60));
    console.log('Super Admin:     melkamuwako5@admin.com / admin123');
    console.log('Museum Admin:    museum.admin@ethioheritage360.com / museum123');
    console.log('Tour Organizer:  organizer@heritagetours.et / tour123');
    console.log('=' .repeat(60));
    console.log('\n💡 Try logging into your frontend now!');

  } catch (error) {
    console.error('❌ Critical error:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 Network/DNS issue - check internet connection');
    } else if (error.message.includes('Authentication failed')) {
      console.error('🔐 MongoDB authentication failed - check credentials');
    } else if (error.message.includes('Network timeout')) {
      console.error('⏰ Connection timeout - MongoDB Atlas may be slow');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the fix
fixProductionUsers();
