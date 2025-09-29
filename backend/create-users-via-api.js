// Create Users via Production API
const axios = require('axios');

const BACKEND_URL = 'https://ethioheritage360-ethiopian-heritage.onrender.com';

async function createUsersViaAPI() {
  console.log('🔄 Creating default users via production API...');
  
  // Users to create
  const defaultUsers = [
    {
      name: 'Super Admin',
      email: 'melkamuwako5@admin.com',
      password: 'admin123',
      role: 'super_admin'
    },
    {
      name: 'Museum Administrator', 
      email: 'museum.admin@ethioheritage360.com',
      password: 'museum123',
      role: 'admin'
    },
    {
      name: 'Heritage Tour Organizer',
      email: 'organizer@heritagetours.et', 
      password: 'tour123',
      role: 'tour_organizer'
    }
  ];

  for (const user of defaultUsers) {
    try {
      console.log(`\n👤 Creating user: ${user.email}`);
      
      const response = await axios.post(`${BACKEND_URL}/api/auth/register`, user, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        console.log(`✅ SUCCESS: ${user.email} created with role ${user.role}`);
      } else {
        console.log(`⚠️ FAILED: ${response.data.message}`);
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        console.log(`✅ ALREADY EXISTS: ${user.email}`);
      } else {
        console.log(`❌ ERROR creating ${user.email}:`, error.response?.data?.message || error.message);
      }
    }
  }

  // Now test logins
  console.log('\n🔍 Testing logins after creation...');
  
  for (const user of defaultUsers) {
    try {
      const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: user.email,
        password: user.password
      });
      
      if (loginResponse.data.success) {
        console.log(`✅ LOGIN SUCCESS: ${user.email} (${loginResponse.data.user.role})`);
      }
    } catch (error) {
      console.log(`❌ LOGIN FAILED: ${user.email} - ${error.response?.data?.message}`);
    }
  }

  console.log('\n🎉 User creation process completed!');
  console.log('\n📋 LOGIN CREDENTIALS:');
  console.log('=' .repeat(60));
  console.log('Super Admin:     melkamuwako5@admin.com / admin123');
  console.log('Museum Admin:    museum.admin@ethioheritage360.com / museum123');
  console.log('Tour Organizer:  organizer@heritagetours.et / tour123');
  console.log('=' .repeat(60));
  console.log('\n💡 These should now work in your frontend!');
}

createUsersViaAPI().catch(console.error);
