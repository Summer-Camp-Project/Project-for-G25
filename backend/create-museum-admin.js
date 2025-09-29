// Create Museum Admin Account
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User Schema (copied from server.js)
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

async function createMuseumAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ethioheritage360', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if museum admin already exists
    const existingAdmin = await User.findOne({ email: 'museum.admin@ethioheritage360.com' });
    if (existingAdmin) {
      console.log('ℹ️ Museum admin already exists');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Name:', existingAdmin.name);
      console.log('🔑 Role:', existingAdmin.role);
      console.log('✅ Active:', existingAdmin.isActive);
      return;
    }

    // Create museum admin
    console.log('🏛️ Creating museum admin account...');
    const museumAdmin = new User({
      name: 'Museum Administrator',
      email: 'museum.admin@ethioheritage360.com',
      password: 'museum123',
      role: 'admin'
    });

    await museumAdmin.save();
    console.log('✅ Museum admin created successfully!');
    console.log('📧 Email: museum.admin@ethioheritage360.com');
    console.log('🔑 Password: museum123');
    console.log('👑 Role: admin');

    // List all users
    console.log('\n📋 Current users in database:');
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

createMuseumAdmin();
