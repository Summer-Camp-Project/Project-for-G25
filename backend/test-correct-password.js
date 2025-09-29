// Test with correct password from seed.js
const axios = require('axios');

const BACKEND_URL = 'https://ethioheritage360-ethiopian-heritage.onrender.com';

async function testCorrectPassword() {
  console.log('🔐 Testing login with CORRECT password from seed.js...');
  
  // Test credentials from seed.js
  const testCredentials = [
    {
      name: 'Super Admin (Melkamu)',
      email: 'melkamuwako5@admin.com',
      password: 'melkamuwako5'  // From seed.js line 55
    },
    {
      name: 'Museum Admin',
      email: 'museum.admin@ethioheritage360.com',
      password: 'museum123'
    },
    {
      name: 'Tour Organizer',
      email: 'organizer@heritagetours.et',
      password: 'organizer123'  // From seed.js line 163
    }
  ];

  console.log('\n📋 Credentials from seed.js:');
  testCredentials.forEach((cred, index) => {
    console.log(`${index + 1}. ${cred.name}: ${cred.email} / ${cred.password}`);
  });
  
  console.log('\n🔍 Testing login attempts...');

  for (const credential of testCredentials) {
    try {
      console.log(`\n👤 Testing ${credential.name}...`);
      
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: credential.email,
        password: credential.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        console.log(`✅ SUCCESS: ${credential.name}`);
        console.log(`   Email: ${response.data.user.email}`);
        console.log(`   Name: ${response.data.user.name}`);
        console.log(`   Role: ${response.data.user.role}`);
        console.log(`   Token: ${response.data.token ? 'Received' : 'Missing'}`);
      }
    } catch (error) {
      console.log(`❌ FAILED: ${credential.name}`);
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Error: ${error.response?.data?.message}`);
    }
  }

  console.log('\n🎯 SUMMARY:');
  console.log('If melkamuwako5@admin.com login fails, it means the user');
  console.log('was not properly seeded or password was changed.');
  console.log('\n💡 You should be able to login with:');
  console.log('Email: melkamuwako5@admin.com');
  console.log('Password: melkamuwako5');
}

testCorrectPassword().catch(console.error);
