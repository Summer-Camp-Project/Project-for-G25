// Create New Super Admin Account
const axios = require('axios');

const BACKEND_URL = 'https://ethioheritage360-ethiopian-heritage.onrender.com';

async function createNewSuperAdmin() {
  console.log('🔄 Creating new Super Admin account...');
  
  const newSuperAdmin = {
    name: 'Melkamu Wako (New)',
    email: 'melkamuwako5.new@admin.com', // Temporary new email
    password: 'melkamuwako5',
    role: 'super_admin'
  };

  try {
    // Register new super admin
    console.log('📝 Registering new super admin account...');
    const response = await axios.post(`${BACKEND_URL}/api/auth/register`, newSuperAdmin, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      console.log('✅ SUCCESS: New Super Admin created!');
      console.log('Name:', response.data.user.name);
      console.log('Email:', response.data.user.email);
      console.log('Role:', response.data.user.role);
      console.log('Token:', response.data.token ? 'Received' : 'Missing');
      
      console.log('\n🎉 NEW LOGIN CREDENTIALS:');
      console.log('=' .repeat(50));
      console.log(`Email: ${newSuperAdmin.email}`);
      console.log(`Password: ${newSuperAdmin.password}`);
      console.log('Role: super_admin');
      console.log('=' .repeat(50));
      console.log('\n💡 Use these credentials to login to your frontend!');
      
      // Test login immediately
      console.log('\n🔍 Testing new account login...');
      try {
        const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
          email: newSuperAdmin.email,
          password: newSuperAdmin.password
        });
        
        if (loginResponse.data.success) {
          console.log('✅ LOGIN TEST: SUCCESS!');
          console.log('User:', loginResponse.data.user.name);
          console.log('Role:', loginResponse.data.user.role);
        }
      } catch (loginError) {
        console.log('❌ LOGIN TEST FAILED:', loginError.response?.data?.message);
      }
      
    } else {
      console.log('⚠️ Registration failed:', response.data.message);
    }
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log('⚠️ User already exists with that email.');
      console.log('💡 Try using one of the existing working accounts:');
      console.log('1. museum.admin@ethioheritage360.com / museum123');
    } else {
      console.log('❌ Error creating super admin:', error.response?.data?.message || error.message);
    }
  }
  
  console.log('\n📋 ALL AVAILABLE WORKING ACCOUNTS:');
  console.log('=' .repeat(60));
  console.log('1. museum.admin@ethioheritage360.com / museum123 (CONFIRMED WORKING)');
  console.log('2. melkamuwako5@admin.com / melkamuwako5 (Locked - wait 30min)');
  console.log('3. melkamuwako5.new@admin.com / melkamuwako5 (If created above)');
  console.log('=' .repeat(60));
}

createNewSuperAdmin().catch(console.error);
