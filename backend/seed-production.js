// Seed Production Database
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Production MongoDB URI
const MONGODB_URI = 'mongodb+srv://melkamuwako5_db_user:YFweyhElTJBj5sXp@cluster0.x3jfm8p.mongodb.net/ethioheritage360?retryWrites=true&w=majority&appName=Cluster0';

// User Schema (exact same as server.js and seed.js)
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

const seedProduction = async () => {
  try {
    console.log('🔄 Connecting to production MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to production database');

    // Clear existing users first to avoid conflicts (CAREFUL!)
    console.log('\n⚠️ WARNING: This will clear existing users and reseed...');
    
    // Uncomment the next line if you want to clear existing users
    // await User.deleteMany({});
    // console.log('🗑️ Cleared existing users');

    // Create admin users from seed.js
    const adminUsers = [
      {
        name: 'Melkamu Wako',
        email: 'melkamuwako5@admin.com',
        password: 'melkamuwako5',
        role: 'super_admin',
        isActive: true
      },
      {
        name: 'Abdurazak M',
        email: 'abdurazakm343@admin.com',
        password: 'THpisvaHUbQNMsbX',
        role: 'super_admin',
        isActive: true
      },
      {
        name: 'Student Pasegid',
        email: 'student.pasegid@admin.com',
        password: 'Fs4HwlXCW4SJvkyN',
        role: 'super_admin',
        isActive: true
      },
      {
        name: 'Naol Aboma',
        email: 'naolaboma@admin.com',
        password: 'QR7ICwI5s6VMgAZD',
        role: 'super_admin',
        isActive: true
      }
    ];

    // Museum admin
    const museumAdmins = [
      {
        name: 'National Museum Admin',
        email: 'museum.admin@ethioheritage360.com',
        password: 'museum123',
        role: 'admin',
        isActive: true
      }
    ];

    // Tour organizers and test users
    const otherUsers = [
      {
        name: 'Heritage Tours Ethiopia',
        email: 'organizer@heritagetours.et',
        password: 'organizer123',
        role: 'tour_organizer',
        isActive: true
      },
      {
        name: 'Tour Guide Demo',
        email: 'tourguide@demo.com',
        password: 'tourguide123',
        role: 'visitor',
        isActive: true
      },
      {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123456',
        role: 'visitor',
        isActive: true
      }
    ];

    // Combine all users
    const allUsers = [...adminUsers, ...museumAdmins, ...otherUsers];

    console.log('\n👥 Creating/updating users...');

    for (const userData of allUsers) {
      try {
        const existingUser = await User.findOne({ email: userData.email });
        
        if (existingUser) {
          console.log(`🔄 Updating existing user: ${userData.email}`);
          // Update password and ensure user is active
          existingUser.password = userData.password;
          existingUser.isActive = true;
          existingUser.name = userData.name;
          existingUser.role = userData.role;
          await existingUser.save();
          console.log(`✅ Updated: ${userData.name} (${userData.email}) - Role: ${userData.role}`);
        } else {
          console.log(`🆕 Creating new user: ${userData.email}`);
          const user = new User(userData);
          await user.save();
          console.log(`✅ Created: ${userData.name} (${userData.email}) - Role: ${userData.role}`);
        }
      } catch (userError) {
        console.error(`❌ Error processing ${userData.email}:`, userError.message);
      }
    }

    // Verify passwords work
    console.log('\n🔍 Testing passwords...');
    
    for (const testUser of allUsers.slice(0, 3)) { // Test first 3 users
      try {
        const user = await User.findOne({ email: testUser.email });
        if (user) {
          const isPasswordValid = await user.comparePassword(testUser.password);
          console.log(`${testUser.email}: ${isPasswordValid ? '✅ PASS' : '❌ FAIL'}`);
        }
      } catch (error) {
        console.log(`❌ Error testing ${testUser.email}:`, error.message);
      }
    }

    console.log('\n🎉 PRODUCTION DATABASE SEEDED SUCCESSFULLY!');
    console.log('\n📋 LOGIN CREDENTIALS FOR YOUR APP:');
    console.log('=' .repeat(70));
    console.log('Super Admins:');
    console.log('1. melkamuwako5@admin.com / melkamuwako5');
    console.log('2. abdurazakm343@admin.com / THpisvaHUbQNMsbX');
    console.log('3. student.pasegid@admin.com / Fs4HwlXCW4SJvkyN');
    console.log('4. naolaboma@admin.com / QR7ICwI5s6VMgAZD');
    console.log('\nMuseum Admin:');
    console.log('5. museum.admin@ethioheritage360.com / museum123');
    console.log('\nTour Organizers/Users:');
    console.log('6. organizer@heritagetours.et / organizer123');
    console.log('7. tourguide@demo.com / tourguide123');
    console.log('8. test@example.com / test123456');
    console.log('=' .repeat(70));
    console.log('\n💡 All accounts are now active and ready for login!');

  } catch (error) {
    console.error('❌ Error seeding production database:', error);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 Network/DNS issue - check internet connection');
    } else if (error.message.includes('Authentication failed')) {
      console.error('🔐 MongoDB authentication failed - check credentials');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the seeding
seedProduction();
