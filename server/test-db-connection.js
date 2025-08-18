const mongoose = require('mongoose');
require('dotenv').config();

const testDBConnection = async () => {
  console.log('Testing MongoDB connection...');
  console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Configured' : 'Not configured');
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set');
    return;
  }
  
  // Hide sensitive information in the URI for logging
  const maskedUri = process.env.MONGODB_URI.replace(/:([^:@]*@)/, ':***@');
  console.log('Attempting to connect to:', maskedUri);
  
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log('Host:', conn.connection.host);
    console.log('Database:', conn.connection.name);
    console.log('Connection State:', conn.connection.readyState);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.length);
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('   → Check your internet connection and MongoDB cluster address');
    }
    if (error.message.includes('Authentication failed')) {
      console.error('   → Check your username and password');
    }
    if (error.message.includes('IP')) {
      console.error('   → Check your MongoDB Atlas IP whitelist settings');
    }
    if (error.message.includes('timeout')) {
      console.error('   → Connection timeout - check network or cluster status');
    }
    
    process.exit(1);
  }
};

testDBConnection();
