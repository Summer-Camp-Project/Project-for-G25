// Seed Live Production Database
// This script calls the /api/admin/seed-users endpoint on your live Render server

const axios = require('axios');

const BACKEND_URL = 'https://ethioheritage360-ethiopian-heritage.onrender.com';
const SECRET_KEY = 'ethioheritage360-setup-secret-2024';

async function seedLiveDatabase() {
  try {
    console.log('🌱 Seeding live production database...');
    console.log('URL:', `${BACKEND_URL}/api/admin/seed-users`);
    console.log('');

    const response = await axios.post(`${BACKEND_URL}/api/admin/seed-users`, {
      secretKey: SECRET_KEY
    });

    console.log('✅ SUCCESS! Admin users created on production!');
    console.log('');
    console.log('📋 Results:');
    console.log('=' .repeat(60));
    
    response.data.results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.email}`);
      console.log(`   Action: ${result.action.toUpperCase()}`);
      console.log(`   Role: ${result.role}`);
      console.log(`   Password Test: ${result.passwordTest || 'N/A'}`);
      console.log('');
    });
    
    console.log('🔑 PRODUCTION LOGIN CREDENTIALS:');
    console.log('=' .repeat(60));
    console.log('✅ Super Admin:    melkamuwako5@admin.com / admin123');
    console.log('✅ Museum Admin:   museum.admin@ethioheritage360.com / museum123'); 
    console.log('✅ Tour Organizer: organizer@heritagetours.et / tour123');
    console.log('=' .repeat(60));
    
    console.log('');
    console.log('🎉 YOUR FRONTEND LOGIN WILL NOW WORK!');
    console.log('🚀 Try logging in with museum.admin@ethioheritage360.com / museum123');

  } catch (error) {
    console.log('❌ Seeding failed:', error.response?.data?.message || error.message);
    
    if (error.response?.status === 401) {
      console.log('🔑 Authentication failed - check secret key');
    } else if (error.response?.status === 500) {
      console.log('🛠️ Server error - check Render logs');
    } else {
      console.log('🌐 Network error - check internet connection');
    }
    
    console.log('');
    console.log('📋 Full error:', error.response?.data || error.message);
  }
}

// Test connection first
async function testConnection() {
  try {
    console.log('🔍 Testing connection to live server...');
    const health = await axios.get(`${BACKEND_URL}/api/health`);
    console.log('✅ Server is online and healthy!');
    console.log('Server message:', health.data.message);
    console.log('');
    return true;
  } catch (error) {
    console.log('❌ Cannot connect to server');
    console.log('Error:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 EthioHeritage360 - Live Database Seeder');
  console.log('=' .repeat(50));
  console.log('');
  
  // Test connection first
  const isOnline = await testConnection();
  
  if (isOnline) {
    await seedLiveDatabase();
  } else {
    console.log('❌ Cannot proceed - server is offline');
  }
}

main();
