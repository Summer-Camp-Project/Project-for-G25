/**
 * MongoDB Connection Test Script
 * 
 * This script tests your MongoDB connection and performs basic operations
 * to verify everything is working correctly.
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

// Connection configuration
const config = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  dbName: process.env.MONGODB_DB_NAME || 'test',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    retryReads: true,
  }
};

// Test data
const testData = {
  name: 'MongoDB Connection Test',
  timestamp: new Date(),
  status: 'testing',
  version: '1.0.0'
};

/**
 * Main test function
 */
async function testMongoDBConnection() {
  let client;
  
  try {
    console.log('🔄 Starting MongoDB connection test...');
    console.log(`📍 Connecting to: ${maskConnectionString(config.uri)}`);
    console.log(`🗂️  Database: ${config.dbName}`);
    console.log('─'.repeat(50));

    // Step 1: Create client and connect
    console.log('1️⃣  Creating MongoDB client...');
    client = new MongoClient(config.uri, config.options);
    
    console.log('2️⃣  Attempting to connect...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // Step 2: Ping the database
    console.log('3️⃣  Pinging database...');
    const pingResult = await client.db('admin').admin().ping();
    console.log('✅ Ping successful:', pingResult);

    // Step 3: Get database and collection
    console.log('4️⃣  Accessing database and collection...');
    const database = client.db(config.dbName);
    const collection = database.collection('connection_test');

    // Step 4: Test write operation
    console.log('5️⃣  Testing write operation...');
    const insertResult = await collection.insertOne(testData);
    console.log('✅ Document inserted with ID:', insertResult.insertedId);

    // Step 5: Test read operation
    console.log('6️⃣  Testing read operation...');
    const findResult = await collection.findOne({ _id: insertResult.insertedId });
    console.log('✅ Document retrieved:', findResult);

    // Step 6: Test update operation
    console.log('7️⃣  Testing update operation...');
    const updateResult = await collection.updateOne(
      { _id: insertResult.insertedId },
      { $set: { status: 'tested', lastUpdate: new Date() } }
    );
    console.log('✅ Document updated. Modified count:', updateResult.modifiedCount);

    // Step 7: Test delete operation
    console.log('8️⃣  Testing delete operation...');
    const deleteResult = await collection.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ Document deleted. Deleted count:', deleteResult.deletedCount);

    // Step 8: Get server information
    console.log('9️⃣  Getting server information...');
    const serverInfo = await client.db('admin').admin().serverStatus();
    console.log('✅ Server info:');
    console.log(`   - Version: ${serverInfo.version}`);
    console.log(`   - Host: ${serverInfo.host}`);
    console.log(`   - Uptime: ${Math.floor(serverInfo.uptime)} seconds`);

    // Step 9: List databases
    console.log('🔟 Listing databases...');
    const databasesList = await client.db().admin().listDatabases();
    console.log('✅ Available databases:');
    databasesList.databases.forEach(db => {
      console.log(`   - ${db.name} (${formatBytes(db.sizeOnDisk)})`);
    });

    console.log('─'.repeat(50));
    console.log('🎉 All tests passed! MongoDB connection is working perfectly.');

  } catch (error) {
    console.error('─'.repeat(50));
    console.error('❌ MongoDB connection test failed!');
    console.error('Error details:', error.message);
    
    // Provide specific error guidance
    if (error.name === 'MongooseServerSelectionError' || error.name === 'MongoServerSelectionError') {
      console.error('\n🔍 Troubleshooting suggestions:');
      console.error('   - Check if MongoDB server is running');
      console.error('   - Verify the connection string');
      console.error('   - Check network connectivity and firewall settings');
      console.error('   - For Atlas: verify IP whitelist and credentials');
    } else if (error.name === 'MongoAuthenticationError') {
      console.error('\n🔍 Authentication issue:');
      console.error('   - Verify username and password');
      console.error('   - Check database user permissions');
      console.error('   - Ensure user has access to the specified database');
    } else if (error.code === 'ENOTFOUND') {
      console.error('\n🔍 DNS/Network issue:');
      console.error('   - Check your internet connection');
      console.error('   - Verify the MongoDB host address');
      console.error('   - For Atlas: ensure the cluster is running');
    }
    
    throw error;
  } finally {
    // Clean up
    if (client) {
      console.log('🔄 Closing connection...');
      await client.close();
      console.log('✅ Connection closed.');
    }
  }
}

/**
 * Mask sensitive information in connection string
 */
function maskConnectionString(uri) {
  return uri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:***@');
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Test specific MongoDB features
 */
async function testAdvancedFeatures() {
  let client;
  
  try {
    console.log('\n🔬 Running advanced feature tests...');
    client = new MongoClient(config.uri, config.options);
    await client.connect();
    
    const database = client.db(config.dbName);
    const collection = database.collection('advanced_test');

    // Test indexing
    console.log('📊 Testing index creation...');
    await collection.createIndex({ timestamp: 1 });
    const indexes = await collection.listIndexes().toArray();
    console.log('✅ Indexes created:', indexes.length);

    // Test aggregation
    console.log('🔄 Testing aggregation pipeline...');
    const sampleDocs = [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 },
      { category: 'A', value: 30 }
    ];
    await collection.insertMany(sampleDocs);

    const aggregationResult = await collection.aggregate([
      { $group: { _id: '$category', total: { $sum: '$value' } } },
      { $sort: { total: -1 } }
    ]).toArray();
    
    console.log('✅ Aggregation result:', aggregationResult);

    // Clean up test data
    await collection.drop();
    console.log('🧹 Test collection cleaned up.');

  } catch (error) {
    console.error('❌ Advanced features test failed:', error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

/**
 * Performance benchmark test
 */
async function performanceBenchmark() {
  let client;
  
  try {
    console.log('\n⚡ Running performance benchmark...');
    client = new MongoClient(config.uri, config.options);
    await client.connect();
    
    const database = client.db(config.dbName);
    const collection = database.collection('performance_test');

    // Bulk insert test
    const startTime = Date.now();
    const bulkDocs = [];
    for (let i = 0; i < 1000; i++) {
      bulkDocs.push({
        index: i,
        data: `test_data_${i}`,
        timestamp: new Date(),
        random: Math.random()
      });
    }

    console.log('📝 Inserting 1000 documents...');
    await collection.insertMany(bulkDocs);
    const insertTime = Date.now() - startTime;

    // Read test
    const readStartTime = Date.now();
    const readResult = await collection.find({}).limit(100).toArray();
    const readTime = Date.now() - readStartTime;

    console.log(`✅ Performance results:`);
    console.log(`   - Insert time: ${insertTime}ms`);
    console.log(`   - Read time: ${readTime}ms`);
    console.log(`   - Documents read: ${readResult.length}`);

    // Clean up
    await collection.drop();

  } catch (error) {
    console.error('❌ Performance benchmark failed:', error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Main execution
if (require.main === module) {
  (async () => {
    try {
      await testMongoDBConnection();
      await testAdvancedFeatures();
      await performanceBenchmark();
      
      console.log('\n🏆 All tests completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('\n💥 Tests failed with error:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = {
  testMongoDBConnection,
  testAdvancedFeatures,
  performanceBenchmark
};
