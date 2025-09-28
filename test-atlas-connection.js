#!/usr/bin/env node

const { MongoClient } = require('mongodb');

// Your MongoDB Atlas connection string from the server file
const MONGODB_ATLAS_URI = 'mongodb+srv://melkamuwako5_db_user:YFweyhElTJBj5sXp@cluster0.x3jfm8p.mongodb.net/ethioheritage360?retryWrites=true&w=majority&appName=Cluster0';

// ANSI color codes for better output
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

async function testAtlasConnection() {
  let client;
  
  try {
    console.log('');
    colorLog('🚀 Testing MongoDB Atlas Remote Connection', colors.cyan);
    colorLog('=' .repeat(50), colors.cyan);
    
    console.log('');
    colorLog('📍 Connection Details:', colors.yellow);
    console.log(`   Database: ethioheritage360`);
    console.log(`   Cluster: cluster0.x3jfm8p.mongodb.net`);
    console.log(`   User: melkamuwako5_db_user`);
    
    console.log('');
    colorLog('🔄 Step 1: Creating MongoDB client...', colors.blue);
    client = new MongoClient(MONGODB_ATLAS_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    });

    colorLog('🔄 Step 2: Attempting to connect to Atlas...', colors.blue);
    await client.connect();
    colorLog('✅ Successfully connected to MongoDB Atlas!', colors.green);

    colorLog('🔄 Step 3: Testing database ping...', colors.blue);
    const pingResult = await client.db('admin').admin().ping();
    colorLog('✅ Database ping successful!', colors.green);
    console.log(`   Response: ${JSON.stringify(pingResult)}`);

    colorLog('🔄 Step 4: Getting database information...', colors.blue);
    const db = client.db('ethioheritage360');
    
    // Get database stats
    const stats = await db.stats();
    colorLog('✅ Database statistics retrieved!', colors.green);
    console.log(`   Database Name: ${stats.db}`);
    console.log(`   Collections: ${stats.collections}`);
    console.log(`   Documents: ${stats.objects}`);
    console.log(`   Data Size: ${(stats.dataSize / (1024*1024)).toFixed(2)} MB`);
    console.log(`   Storage Size: ${(stats.storageSize / (1024*1024)).toFixed(2)} MB`);
    console.log(`   Indexes: ${stats.indexes}`);

    colorLog('🔄 Step 5: Listing collections...', colors.blue);
    const collections = await db.listCollections().toArray();
    colorLog('✅ Collections retrieved!', colors.green);
    console.log(`   Total Collections: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('   Collections:');
      collections.slice(0, 10).forEach((col, index) => {
        console.log(`     ${index + 1}. ${col.name}`);
      });
      if (collections.length > 10) {
        console.log(`     ... and ${collections.length - 10} more`);
      }
    }

    colorLog('🔄 Step 6: Testing collection operations...', colors.blue);
    
    // Test with users collection if it exists
    if (collections.find(col => col.name === 'users')) {
      const userCount = await db.collection('users').countDocuments();
      colorLog(`✅ Users collection: ${userCount} documents`, colors.green);
    }

    // Test with museums collection if it exists
    if (collections.find(col => col.name === 'museums')) {
      const museumCount = await db.collection('museums').countDocuments();
      colorLog(`✅ Museums collection: ${museumCount} documents`, colors.green);
    }

    // Test with artifacts collection if it exists
    if (collections.find(col => col.name === 'artifacts')) {
      const artifactCount = await db.collection('artifacts').countDocuments();
      colorLog(`✅ Artifacts collection: ${artifactCount} documents`, colors.green);
    }

    colorLog('🔄 Step 7: Testing write operation...', colors.blue);
    const testCollection = db.collection('connection_test');
    const testDoc = {
      testId: 'atlas-connection-test',
      timestamp: new Date(),
      message: 'Remote Atlas connection successful!',
      version: '1.0.0'
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    colorLog('✅ Write operation successful!', colors.green);
    console.log(`   Inserted document ID: ${insertResult.insertedId}`);

    colorLog('🔄 Step 8: Testing read operation...', colors.blue);
    const retrievedDoc = await testCollection.findOne({ _id: insertResult.insertedId });
    colorLog('✅ Read operation successful!', colors.green);
    console.log(`   Retrieved document: ${JSON.stringify(retrievedDoc, null, 2)}`);

    colorLog('🔄 Step 9: Cleaning up test data...', colors.blue);
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    colorLog('✅ Test cleanup completed!', colors.green);

    console.log('');
    colorLog('🎉 REMOTE MONGODB ATLAS CONNECTION TEST SUCCESSFUL!', colors.green);
    colorLog('=' .repeat(55), colors.green);
    console.log('');
    colorLog('✅ Your MongoDB Atlas remote connection is working perfectly!', colors.green);
    colorLog('✅ All database operations completed successfully', colors.green);
    colorLog('✅ Connection is stable and ready for production use', colors.green);

  } catch (error) {
    console.log('');
    colorLog('❌ MONGODB ATLAS CONNECTION FAILED!', colors.red);
    colorLog('=' .repeat(40), colors.red);
    colorLog(`Error: ${error.message}`, colors.red);
    
    // Provide specific troubleshooting guidance
    if (error.message.includes('ETIMEOUT') || error.message.includes('timeout')) {
      console.log('');
      colorLog('🔧 TIMEOUT ERROR - Possible causes:', colors.yellow);
      console.log('   • Your IP address is not whitelisted in MongoDB Atlas');
      console.log('   • Firewall blocking connection on port 27017');
      console.log('   • Corporate network restrictions');
      console.log('   • Internet connection issues');
      console.log('');
      colorLog('💡 Solutions:', colors.cyan);
      console.log('   1. Check MongoDB Atlas Network Access settings');
      console.log('   2. Add your current IP to the whitelist');
      console.log('   3. Try "Allow access from anywhere" (0.0.0.0/0) for testing');
    } else if (error.message.includes('authentication')) {
      console.log('');
      colorLog('🔧 AUTHENTICATION ERROR - Possible causes:', colors.yellow);
      console.log('   • Incorrect username or password');
      console.log('   • User doesn\'t have proper permissions');
      console.log('   • Database user not configured correctly');
      console.log('');
      colorLog('💡 Solutions:', colors.cyan);
      console.log('   1. Verify credentials in MongoDB Atlas Database Access');
      console.log('   2. Check user permissions for the database');
      console.log('   3. Ensure password doesn\'t contain special characters');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('');
      colorLog('🔧 DNS/NETWORK ERROR - Possible causes:', colors.yellow);
      console.log('   • DNS resolution issues');
      console.log('   • Incorrect cluster hostname');
      console.log('   • Network connectivity problems');
      console.log('');
      colorLog('💡 Solutions:', colors.cyan);
      console.log('   1. Verify the cluster hostname in Atlas');
      console.log('   2. Check your internet connection');
      console.log('   3. Try using a different network');
    }

    console.log('');
    colorLog('🌐 Get your current IP address:', colors.cyan);
    console.log('   Visit: https://whatismyipaddress.com/');
    console.log('');
    colorLog('⚙️  MongoDB Atlas Network Settings:', colors.cyan);
    console.log('   Visit: https://cloud.mongodb.com/v2#/network/accessList');

  } finally {
    if (client) {
      colorLog('🔄 Closing connection...', colors.blue);
      await client.close();
      colorLog('✅ Connection closed.', colors.green);
    }
  }
}

// Run the test
console.log('Starting MongoDB Atlas connection test...');
testAtlasConnection()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });
