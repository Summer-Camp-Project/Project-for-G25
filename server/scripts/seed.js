const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../config/env');
const { createSecureUser, logCredentialsSafely, validatePassword } = require('../utils/secureSeeding');
require('dotenv').config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB for seeding...');

    // Clear existing users (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // console.log('Cleared existing users');

    console.log('🔐 Creating admin users with secure credentials...');
    
    // Create admin users with secure environment-based credentials
    const adminUserTemplates = [
      {
        firstName: 'Melkamu',
        lastName: 'Wako',
        name: 'Melkamu Wako',
        email: 'melkamuwako5@admin.com', // fallback - use ADMIN1_EMAIL env var
        role: 'superAdmin',
        profile: {
          bio: 'Super Administrator of EthioHeritage360 platform'
        },
        preferences: {
          language: 'en',
          notifications: { email: true, push: true }
        },
        isEmailVerified: true,
        isActive: true
      },
      {
        firstName: 'Abdurazak',
        lastName: 'M',
        name: 'Abdurazak M',
        email: 'abdurazakm343@admin.com', // fallback - use ADMIN2_EMAIL env var
        role: 'superAdmin',
        profile: {
          bio: 'Database Administrator with readWriteAnyDatabase privileges'
        },
        preferences: {
          language: 'en',
          notifications: { email: true, push: true }
        },
        isEmailVerified: true,
        isActive: true
      },
      {
        firstName: 'Student',
        lastName: 'Pasegid',
        name: 'Student Pasegid',
        email: 'student.pasegid@admin.com', // fallback - use ADMIN3_EMAIL env var
        role: 'superAdmin',
        profile: {
          bio: 'Database Administrator for ethioheritage360 database'
        },
        preferences: {
          language: 'en',
          notifications: { email: true, push: true }
        },
        isEmailVerified: true,
        isActive: true
      },
      {
        firstName: 'Naol',
        lastName: 'Aboma',
        name: 'Naol Aboma',
        email: 'naolaboma@admin.com', // fallback - use ADMIN4_EMAIL env var
        role: 'superAdmin',
        profile: {
          bio: 'Super Administrator with full system access'
        },
        preferences: {
          language: 'en',
          notifications: { email: true, push: true }
        },
        isEmailVerified: true,
        isActive: true
      }
    ];
    
    // Create secure admin users using environment variables
    const adminUsers = [
      createSecureUser(adminUserTemplates[0], 'ADMIN1_EMAIL', 'ADMIN1_PASSWORD'),
      createSecureUser(adminUserTemplates[1], 'ADMIN2_EMAIL', 'ADMIN2_PASSWORD'),
      createSecureUser(adminUserTemplates[2], 'ADMIN3_EMAIL', 'ADMIN3_PASSWORD'),
      createSecureUser(adminUserTemplates[3], 'ADMIN4_EMAIL', 'ADMIN4_PASSWORD')
    ];

    // Create museum admin users with secure credentials
    const museumAdminTemplate = {
      firstName: 'National Museum',
      lastName: 'Admin',
      name: 'National Museum Admin',
      email: 'museum.admin@ethioheritage360.com',
      role: 'museumAdmin',
      profile: { bio: 'Administrator for National Museum of Ethiopia' },
      preferences: { language: 'en', notifications: { email: true, push: true } },
      isEmailVerified: true,
      isActive: true
    };
    const museumAdmins = [
      createSecureUser(museumAdminTemplate, 'MUSEUM_ADMIN_EMAIL', 'MUSEUM_ADMIN_PASSWORD')
    ];

    // Create test users including organizers with secure credentials
    const testUserTemplates = [
      {
        firstName: 'Heritage Tours',
        lastName: 'Ethiopia',
        name: 'Heritage Tours Ethiopia',
        email: 'organizer@heritagetours.et',
        role: 'user',
        profile: { bio: 'Professional heritage tour organizer specializing in Ethiopian cultural sites' },
        preferences: { language: 'en', notifications: { email: true, push: true } },
        isEmailVerified: true,
        isActive: true
      },
      {
        firstName: 'Tour Guide',
        lastName: 'Demo',
        name: 'Tour Guide Demo',
        email: 'tourguide@demo.com',
        role: 'user',
        profile: { bio: 'Demo tour organizer account for testing dashboard access' },
        preferences: { language: 'en', notifications: { email: true, push: true } },
        isEmailVerified: true,
        isActive: true
      },
      {
        firstName: 'Test',
        lastName: 'User',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        profile: { bio: 'Test user for development and authentication testing' },
        preferences: { language: 'en', notifications: { email: true, push: true } },
        isEmailVerified: true,
        isActive: true
      }
    ];
    
    const testUsers = [
      createSecureUser(testUserTemplates[0], 'ORGANIZER_EMAIL', 'ORGANIZER_PASSWORD'),
      createSecureUser(testUserTemplates[1], 'TOUR_GUIDE_EMAIL', 'TOUR_GUIDE_PASSWORD'),
      createSecureUser(testUserTemplates[2], 'TEST_USER_EMAIL', 'TEST_USER_PASSWORD')
    ];

    // Combine all users
    const allUsers = [...adminUsers, ...museumAdmins, ...testUsers];

    // Insert users
    for (const userData of allUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`Created user: ${userData.name} (${userData.email}) - Role: ${userData.role}`);
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    }

    console.log('✅ Database seeding completed successfully!\n');
    
    // Log credentials safely (will show generated passwords only)
    logCredentialsSafely(allUsers);
    
    console.log('📝 NEXT STEPS:');
    console.log('   1. Save any auto-generated passwords shown above');
    console.log('   2. Set environment variables in .env for production');
    console.log('   3. Start the server: npm run dev');
    console.log('   4. Change generated passwords after first login');
    console.log('   5. Remove hardcoded credentials from other files\n');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeding function
seedUsers();

