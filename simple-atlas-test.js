#!/usr/bin/env node

const { MongoClient } = require('mongodb');

// Your MongoDB Atlas connection string
const MONGODB_ATLAS_URI = 'mongodb+srv://melkamuwako5_db_user:YFweyhElTJBj5sXp@cluster0.x3jfm8p.mongodb.net/ethioheritage360?retryWrites=true&w=majority&appName=Cluster0';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function colorLog(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function simpleConnectionTest() {
  let client;
  
  try {
    colorLog('🚀 Simple MongoDB Atlas Connection Test', colors.cyan);
    colorLog('=' .repeat(45), colors.cyan);
    console.log('');

    // Test DNS resolution first
    colorLog('🔍 Step 1: Testing DNS resolution...', colors.blue);
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      
      const { stdout } = await execAsync('nslookup cluster0.x3jfm8p.mongodb.net');
      if (stdout.includes('Address:')) {
        colorLog('✅ DNS resolution works', colors.green);
      } else {
        colorLog('⚠️  DNS resolution unclear', colors.yellow);
      }
    } catch (error) {
      colorLog('❌ DNS test failed', colors.red);
    }

    console.log('');
    colorLog('🔄 Step 2: Testing MongoDB connection with long timeout...', colors.blue);
    console.log('   This may take up to 60 seconds...');
    
    client = new MongoClient(MONGODB_ATLAS_URI, {
      serverSelectionTimeoutMS: 60000, // 60 seconds
      connectTimeoutMS: 60000,
      socketTimeoutMS: 60000
    });

    const startTime = Date.now();
    await client.connect();
    const connectTime = Date.now() - startTime;
    
    colorLog(`✅ CONNECTION SUCCESSFUL! (${connectTime}ms)`, colors.green);
    
    // Test basic operations
    colorLog('🔄 Step 3: Testing database operations...', colors.blue);
    
    const db = client.db('ethioheritage360');
    await db.admin().ping();
    colorLog('✅ Database ping successful!', colors.green);
    
    const collections = await db.listCollections().toArray();
    colorLog(`✅ Found ${collections.length} collections`, colors.green);
    
    if (collections.length > 0) {
      console.log('   Collections found:');
      collections.slice(0, 5).forEach((col, index) => {
        console.log(`   ${index + 1}. ${col.name}`);
      });
      if (collections.length > 5) {
        console.log(`   ... and ${collections.length - 5} more`);
      }
    }

    console.log('');
    colorLog('🎉 SUCCESS! Your MongoDB Atlas connection is working perfectly!', colors.green);
    colorLog('✅ Your remote database is accessible and ready to use', colors.green);
    
    return true;
    
  } catch (error) {
    console.log('');
    colorLog('❌ CONNECTION FAILED', colors.red);
    colorLog('Error: ' + error.message, colors.red);
    
    // Analyze the error type
    if (error.message.includes('ETIMEOUT') || error.message.includes('timeout')) {
      console.log('');
      colorLog('🔧 This is a NETWORK/FIREWALL issue:', colors.yellow);
      console.log('');
      console.log('Possible causes:');
      console.log('• Corporate firewall blocking MongoDB connections');
      console.log('• ISP blocking port 27017/443');
      console.log('• Antivirus software blocking the connection');
      console.log('• Local Windows firewall settings');
      console.log('');
      console.log('Solutions to try:');
      console.log('1. 📱 Test with mobile hotspot (different network)');
      console.log('2. 🔧 Temporarily disable Windows firewall');
      console.log('3. 🔧 Temporarily disable antivirus');
      console.log('4. 🌐 Try a VPN service');
      console.log('5. 💻 Use MongoDB Compass (GUI tool)');
      console.log('6. ☁️  Use Google Cloud Shell instead');
      console.log('');
      colorLog('📋 Google Cloud Shell (always works):', colors.cyan);
      console.log('   1. Go to: https://console.cloud.google.com/');
      console.log('   2. Click the shell icon (>_) in top bar');
      console.log('   3. Run: curl -L https://bit.ly/install-mongosh | bash');
      console.log('   4. Then connect with your connection string');
    }
    
    return false;
    
  } finally {
    if (client) {
      try {
        await client.close();
        colorLog('🔄 Connection closed', colors.blue);
      } catch (e) {
        // Ignore
      }
    }
  }
}

// Run the test
console.log('Starting simple connection test...');
simpleConnectionTest()
  .then((success) => {
    if (success) {
      console.log('\nYour MongoDB Atlas setup is complete and working! 🎉');
    } else {
      console.log('\nConnection test completed with issues. See suggestions above.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Test error:', error);
    process.exit(1);
  });
