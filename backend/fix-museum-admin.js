// Fix Museum Admin Account - Create with correct schema for server.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Use the SAME schema as server.js
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

async function fixMuseumAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ethioheritage360', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Delete existing museum admin if exists
    await User.deleteOne({ email: 'museum.admin@ethioheritage360.com' });
    console.log('🗑️ Removed old museum admin (if existed)');

    // Create museum admin with CORRECT schema for server.js
    console.log('🏛️ Creating museum admin account with correct schema...');
    const museumAdmin = new User({
      name: 'Museum Administrator',
      email: 'museum.admin@ethioheritage360.com',
      password: 'museum123',
      role: 'admin', // This matches server.js enum
      isActive: true
    });

    await museumAdmin.save();
    console.log('✅ Museum admin created successfully!');
    console.log('📧 Email: museum.admin@ethioheritage360.com');
    console.log('🔑 Password: museum123');
    console.log('👑 Role: admin');

    // Test password comparison
    const isPasswordValid = await museumAdmin.comparePassword('museum123');
    console.log('🔓 Password validation test:', isPasswordValid ? 'PASSED' : 'FAILED');

    // List current users with server.js compatible roles
    console.log('\n📋 All users with compatible roles:');
    const users = await User.find({}, 'name email role isActive createdAt');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - Active: ${user.isActive}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

fixMuseumAdmin();
