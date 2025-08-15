const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../config/env');

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

    // Create admin users based on provided credentials
    const adminUsers = [
      {
        name: 'Melkamu Wako',
        email: 'melkamuwako5@admin.com',
        password: 'melkamuwako5',
        role: 'super_admin',
        profile: {
          bio: 'Super Administrator of EthioHeritage360 platform',
          preferences: {
            language: 'en',
            notifications: {
              email: true,
              push: true
            }
          }
        },
        isEmailVerified: true,
        isActive: true
      },
      {
        name: 'Abdurazak M',
        email: 'abdurazakm343@admin.com',
        password: 'THpisvaHUbQNMsbX',
        role: 'super_admin',
        profile: {
          bio: 'Database Administrator with readWriteAnyDatabase privileges',
          preferences: {
            language: 'en',
            notifications: {
              email: true,
              push: true
            }
          }
        },
        isEmailVerified: true,
        isActive: true
      },
      {
        name: 'Student Pasegid',
        email: 'student.pasegid@admin.com',
        password: 'Fs4HwlXCW4SJvkyN',
        role: 'super_admin',
        profile: {
          bio: 'Database Administrator for ethioheritage360 database',
          preferences: {
            language: 'en',
            notifications: {
              email: true,
              push: true
            }
          }
        },
        isEmailVerified: true,
        isActive: true
      },
      {
        name: 'Naol Aboma',
        email: 'naolaboma@admin.com',
        password: 'QR7ICwI5s6VMgAZD',
        role: 'super_admin',
        profile: {
          bio: 'Super Administrator with full system access',
          preferences: {
            language: 'en',
            notifications: {
              email: true,
              push: true
            }
          }
        },
        isEmailVerified: true,
        isActive: true
      }
    ];

    // Create museum admin users
    const museumAdmins = [
      {
        name: 'National Museum Admin',
        email: 'museum.admin@ethioheritage360.com',
        password: 'museum123',
        role: 'museum',
        profile: {
          bio: 'Administrator for National Museum of Ethiopia',
          preferences: {
            language: 'en',
            notifications: {
              email: true,
              push: true
            }
          }
        },
        museumInfo: {
          name: 'National Museum of Ethiopia',
          description: 'The premier museum showcasing Ethiopian heritage and culture',
          location: {
            type: 'Point',
            coordinates: [38.7578, 9.0192], // Addis Ababa coordinates
            address: 'King George VI Street, Addis Ababa, Ethiopia'
          },
          contactInfo: {
            phone: '+251-11-117-150',
            email: 'info@nationalmuseum.et',
            website: 'https://nationalmuseum.et'
          },
          operatingHours: {
            monday: { open: '08:30', close: '17:30' },
            tuesday: { open: '08:30', close: '17:30' },
            wednesday: { open: '08:30', close: '17:30' },
            thursday: { open: '08:30', close: '17:30' },
            friday: { open: '08:30', close: '17:30' },
            saturday: { open: '08:30', close: '17:30' },
            sunday: { open: '08:30', close: '17:30' }
          },
          admissionFee: {
            adult: 50,
            child: 25,
            student: 30,
            senior: 35
          },
          verified: true
        },
        isEmailVerified: true,
        isActive: true
      }
    ];

    // Create sample organizer
    const organizers = [
      {
        name: 'Heritage Tours Ethiopia',
        email: 'organizer@heritagetours.et',
        password: 'organizer123',
        role: 'organizer',
        profile: {
          bio: 'Professional heritage tour organizer specializing in Ethiopian cultural sites',
          preferences: {
            language: 'en',
            notifications: {
              email: true,
              push: true
            }
          }
        },
        organizerInfo: {
          company: 'Heritage Tours Ethiopia Ltd.',
          license: 'HTE-2024-001',
          specializations: ['cultural-tours', 'historical-tours', 'archaeological-tours'],
          rating: 4.8,
          totalTours: 150,
          verified: true
        },
        isEmailVerified: true,
        isActive: true
      }
    ];

    // Combine all users
    const allUsers = [...adminUsers, ...museumAdmins, ...organizers];

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

    console.log('Database seeding completed successfully!');
    console.log('\nAdmin Users Created:');
    console.log('1. melkamuwako5@admin.com / melkamuwako5 (Super Admin)');
    console.log('2. abdurazakm343@admin.com / THpisvaHUbQNMsbX (DB Admin)');
    console.log('3. student.pasegid@admin.com / Fs4HwlXCW4SJvkyN (DB Admin)');
    console.log('4. naolaboma@admin.com / QR7ICwI5s6VMgAZD (Super Admin)');
    console.log('\nMuseum Admin:');
    console.log('5. museum.admin@ethioheritage360.com / museum123 (Museum Admin)');
    console.log('\nTour Organizer:');
    console.log('6. organizer@heritagetours.et / organizer123 (Tour Organizer)');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeding function
seedUsers();

