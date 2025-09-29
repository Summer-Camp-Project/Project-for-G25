// Test Live Backend Server on Render
const axios = require('axios');

const BACKEND_URL = 'https://ethioheritage360-ethiopian-heritage.onrender.com';

async function testLiveBackend() {
  try {
    console.log('🌐 Testing live backend server...');
    console.log('URL:', BACKEND_URL);

    // Test 1: Health Check
    console.log('\n1️⃣ Testing server health...');
    try {
      const health = await axios.get(`${BACKEND_URL}/api/health`);
      console.log('✅ Server is ALIVE');
      console.log('Status:', health.data.status);
      console.log('Message:', health.data.message);
      console.log('Uptime:', health.data.uptime);
    } catch (error) {
      console.log('❌ Health check failed:', error.message);
      return;
    }

    // Test 2: Check OpenAI Status
    console.log('\n2️⃣ Testing OpenAI integration...');
    try {
      const openaiStatus = await axios.get(`${BACKEND_URL}/api/openai/status`);
      console.log('OpenAI Status:', openaiStatus.data.status);
      console.log('Message:', openaiStatus.data.message);
    } catch (error) {
      console.log('⚠️ OpenAI status check failed:', error.response?.data?.message || error.message);
    }

    // Test 3: Test Museum Admin Login
    console.log('\n3️⃣ Testing museum admin login...');
    try {
      const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: 'museum.admin@ethioheritage360.com',
        password: 'museum123'
      });
      console.log('✅ MUSEUM ADMIN LOGIN SUCCESSFUL!');
      console.log('User:', loginResponse.data.user.name);
      console.log('Role:', loginResponse.data.user.role);
      console.log('Token received:', loginResponse.data.token ? 'Yes' : 'No');
    } catch (error) {
      console.log('❌ Museum admin login FAILED');
      console.log('Status:', error.response?.status);
      console.log('Error:', error.response?.data?.message);
      
      if (error.response?.data?.message === 'Invalid email or password') {
        console.log('\n🔍 This means either:');
        console.log('   - User does not exist in database');
        console.log('   - Password is incorrect');
        console.log('   - User is deactivated');
      }
    }

    // Test 4: Test Super Admin Login
    console.log('\n4️⃣ Testing super admin login...');
    try {
      const adminLogin = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: 'melkamuwako5@admin.com',
        password: 'admin123'
      });
      console.log('✅ SUPER ADMIN LOGIN SUCCESSFUL!');
      console.log('User:', adminLogin.data.user.name);
      console.log('Role:', adminLogin.data.user.role);
    } catch (error) {
      console.log('❌ Super admin login failed');
      console.log('Error:', error.response?.data?.message);
    }

    // Test 5: Test Tour Organizer Login
    console.log('\n5️⃣ Testing tour organizer login...');
    try {
      const tourLogin = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: 'organizer@heritagetours.et',
        password: 'tour123'
      });
      console.log('✅ TOUR ORGANIZER LOGIN SUCCESSFUL!');
      console.log('User:', tourLogin.data.user.name);
      console.log('Role:', tourLogin.data.user.role);
    } catch (error) {
      console.log('❌ Tour organizer login failed');
      console.log('Error:', error.response?.data?.message);
    }

    // Test 6: Get All Users (if we have admin token)
    console.log('\n6️⃣ Testing user list endpoint...');
    try {
      const users = await axios.get(`${BACKEND_URL}/api/users`);
      console.log('✅ User list retrieved');
      console.log('Total users:', users.data.data.length);
      users.data.data.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - Active: ${user.isActive}`);
      });
    } catch (error) {
      console.log('⚠️ Could not get user list:', error.response?.data?.message);
    }

    console.log('\n🎉 LIVE BACKEND TEST COMPLETE!');

  } catch (error) {
    console.error('💥 Critical error:', error.message);
  }
}

// Also test from frontend perspective
async function testFromFrontend() {
  console.log('\n🖥️ SIMULATING FRONTEND LOGIN REQUEST...');
  console.log('This matches exactly what your Netlify frontend is doing:\n');
  
  const config = {
    method: 'POST',
    url: 'https://ethioheritage360-ethiopian-heritage.onrender.com/api/auth/login',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'https://ethioheritage360-ethiopianheritagepf.netlify.app'
    },
    data: {
      email: 'museum.admin@ethioheritage360.com',
      password: 'museum123'
    }
  };

  try {
    const response = await axios(config);
    console.log('✅ FRONTEND SIMULATION: LOGIN SUCCESS');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ FRONTEND SIMULATION: LOGIN FAILED');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data);
    console.log('\nThis is exactly what your frontend is experiencing!');
  }
}

// Run tests
testLiveBackend().then(() => {
  return testFromFrontend();
});
