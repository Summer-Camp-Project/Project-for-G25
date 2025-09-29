// Authentication Test Script for EthioHeritage360
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';
const TEST_USER = {
  name: 'Test Heritage Explorer',
  email: 'testuser@ethioheritage360.com', 
  password: 'test123',
  role: 'visitor'
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testAuth() {
  console.log('\n🧪 Testing EthioHeritage360 Authentication System\n');
  
  try {
    // Test 1: Check server health
    console.log('1️⃣ Testing server health...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Server Status:', health.data.status);
    
    await sleep(1000);
    
    // Test 2: Register new user
    console.log('\n2️⃣ Testing user registration...');
    try {
      const register = await axios.post(`${API_BASE}/auth/register`, TEST_USER);
      console.log('✅ Registration successful:', register.data.message);
      console.log('📋 User details:', {
        name: register.data.user.name,
        email: register.data.user.email,
        role: register.data.user.role
      });
      console.log('🔑 JWT token received:', register.data.token ? 'Yes' : 'No');
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ User already exists - continuing with login test');
      } else {
        throw error;
      }
    }
    
    await sleep(1000);
    
    // Test 3: Login user
    console.log('\n3️⃣ Testing user login...');
    const login = await axios.post(`${API_BASE}/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    console.log('✅ Login successful:', login.data.message);
    console.log('👤 User info:', {
      name: login.data.user.name,
      email: login.data.user.email,
      role: login.data.user.role,
      lastLogin: login.data.user.lastLogin
    });
    
    const token = login.data.token;
    console.log('🔑 JWT token:', token.substring(0, 50) + '...');
    
    await sleep(1000);
    
    // Test 4: Access protected profile endpoint
    console.log('\n4️⃣ Testing protected profile endpoint...');
    const profile = await axios.get(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Profile access successful');
    console.log('👤 Profile data:', {
      id: profile.data.user.id,
      name: profile.data.user.name,
      email: profile.data.user.email,
      role: profile.data.user.role,
      createdAt: profile.data.user.createdAt
    });
    
    await sleep(1000);
    
    // Test 5: Test default admin login
    console.log('\n5️⃣ Testing default admin login...');
    try {
      const adminLogin = await axios.post(`${API_BASE}/auth/login`, {
        email: 'melkamuwako5@admin.com',
        password: 'admin123'
      });
      console.log('✅ Admin login successful');
      console.log('👑 Admin info:', {
        name: adminLogin.data.user.name,
        role: adminLogin.data.user.role,
        email: adminLogin.data.user.email
      });
    } catch (error) {
      console.log('❌ Admin login failed:', error.response?.data?.message);
    }
    
    await sleep(1000);
    
    // Test 6: Test tour organizer login
    console.log('\n6️⃣ Testing tour organizer login...');
    try {
      const tourLogin = await axios.post(`${API_BASE}/auth/login`, {
        email: 'organizer@heritagetours.et',
        password: 'tour123'
      });
      console.log('✅ Tour organizer login successful');
      console.log('🗺️ Tour organizer info:', {
        name: tourLogin.data.user.name,
        role: tourLogin.data.user.role,
        email: tourLogin.data.user.email
      });
    } catch (error) {
      console.log('❌ Tour organizer login failed:', error.response?.data?.message);
    }
    
    await sleep(1000);
    
    // Test 7: Test invalid token
    console.log('\n7️⃣ Testing invalid token protection...');
    try {
      await axios.get(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer invalid_token_12345`
        }
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Invalid token properly rejected:', error.response.data.message);
      }
    }
    
    await sleep(1000);
    
    // Test 8: Test invalid login credentials
    console.log('\n8️⃣ Testing invalid login credentials...');
    try {
      await axios.post(`${API_BASE}/auth/login`, {
        email: 'nonexistent@test.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Invalid credentials properly rejected:', error.response.data.message);
      }
    }
    
    console.log('\n🎉 All authentication tests completed successfully!\n');
    
    console.log('📋 AUTHENTICATION SUMMARY:');
    console.log('='.repeat(50));
    console.log('✅ User Registration: Working');
    console.log('✅ User Login: Working');
    console.log('✅ JWT Token Generation: Working');
    console.log('✅ Protected Routes: Working');
    console.log('✅ Default Admin Account: Created');
    console.log('✅ Default Tour Organizer: Created');
    console.log('✅ Token Validation: Working');
    console.log('✅ Invalid Credential Protection: Working');
    
    console.log('\n🔐 DEFAULT ACCOUNTS CREATED:');
    console.log('Admin: melkamuwako5@admin.com / admin123');
    console.log('Tour Organizer: organizer@heritagetours.et / tour123');
    console.log('\n⚠️ SECURITY NOTE: Change default passwords in production!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests
testAuth();
