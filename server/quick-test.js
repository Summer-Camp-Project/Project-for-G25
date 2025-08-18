const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔄 Testing MongoDB Atlas connection...');
console.log('📍 Your IP being tested: 196.188.252.156');

const testConnection = async () => {
  try {
    console.log('⏳ Connecting to Atlas...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000,
    });

    console.log('✅ SUCCESS! Connected to MongoDB Atlas');
    console.log('🎯 Host:', conn.connection.host);
    console.log('🗄️  Database:', conn.connection.name);
    console.log('📊 Connection State:', conn.connection.readyState === 1 ? 'Connected' : 'Not Connected');
    
    // Test database operation
    const admin = mongoose.connection.db.admin();
    const result = await admin.ping();
    console.log('🏓 Database Ping:', result.ok === 1 ? 'Success' : 'Failed');
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected successfully');
    console.log('\n🎉 ATLAS CONNECTION WORKING! Your server can now connect to MongoDB Atlas.');
    
  } catch (error) {
    console.error('❌ Connection Failed:', error.message);
    
    if (error.message.includes('ETIMEOUT')) {
      console.error('💡 Solution: Make sure IP 196.188.252.156 is added to IP Access List in Atlas');
    }
    if (error.message.includes('Authentication failed')) {
      console.error('💡 Solution: Check username/password in Database Access');
    }
    if (error.message.includes('ENOTFOUND')) {
      console.error('💡 Solution: Check internet connection and cluster URL');
    }
  }
};

testConnection();
