#!/usr/bin/env node

const { MongoClient } = require('mongodb');

// Your original connection string
const MONGODB_ATLAS_URI = 'mongodb+srv://melkamuwako5_db_user:YFweyhElTJBj5sXp@cluster0.x3jfm8p.mongodb.net/ethioheritage360?retryWrites=true&w=majority&appName=Cluster0';

// Alternative connection string (non-SRV)
const MONGODB_ATLAS_URI_STANDARD = 'mongodb://melkamuwako5_db_user:YFweyhElTJBj5sXp@cluster0-shard-00-00.x3jfm8p.mongodb.net:27017,cluster0-shard-00-01.x3jfm8p.mongodb.net:27017,cluster0-shard-00-02.x3jfm8p.mongodb.net:27017/ethioheritage360?ssl=true&replicaSet=atlas-14hdwy-shard-0&authSource=admin&retryWrites=true&w=majority';

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

async function testConnection(uri, label, timeout = 10000) {
  let client;
  
  try {
    console.log('');
    colorLog(`🧪 Testing ${label}...`, colors.cyan);
    colorLog('='.repeat(50), colors.cyan);
    
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: timeout,
      connectTimeoutMS: timeout,
      socketTimeoutMS: timeout,
      maxPoolSize: 5
    });

    colorLog(`⏱️  Attempting connection (timeout: ${timeout/1000}s)...`, colors.blue);
    const startTime = Date.now();
    
    await client.connect();
    const connectTime = Date.now() - startTime;
    
    colorLog(`✅ ${label} SUCCESSFUL! (${connectTime}ms)`, colors.green);
    
    // Quick ping test
    await client.db('admin').admin().ping();
    colorLog('✅ Database ping successful!', colors.green);
    
    // Get basic info
    const db = client.db('ethioheritage360');
    const collections = await db.listCollections().toArray();
    colorLog(`✅ Found ${collections.length} collections`, colors.green);
    
    return true;
    
  } catch (error) {
    const connectTime = Date.now() - (client ? startTime : Date.now());
    colorLog(`❌ ${label} FAILED (${connectTime}ms)`, colors.red);
    colorLog(`   Error: ${error.message}`, colors.red);
    return false;
    
  } finally {
    if (client) {
      try {
        await client.close();
      } catch (e) {
        // Ignore close errors
      }
    }
  }
}

async function testNetworkConnectivity() {
  console.log('');
  colorLog('🌐 Testing Network Connectivity...', colors.cyan);
  colorLog('='.repeat(40), colors.cyan);
  
  // Test DNS resolution
  try {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    colorLog('🔍 Testing DNS resolution...', colors.blue);
    
    // Test nslookup (Windows)
    try {
      const { stdout } = await execAsync('nslookup cluster0.x3jfm8p.mongodb.net');
      if (stdout.includes('Address:')) {
        colorLog('✅ DNS resolution successful', colors.green);
        console.log(stdout.split('\n').filter(line => line.includes('Address:')).slice(0, 2).join('\n'));
      } else {
        colorLog('❌ DNS resolution failed', colors.red);
      }
    } catch (error) {
      colorLog('❌ DNS test error', colors.red);
    }
    
    // Test basic connectivity
    colorLog('🔍 Testing basic connectivity...', colors.blue);
    try {
      const { stdout } = await execAsync('ping -n 1 cluster0.x3jfm8p.mongodb.net');
      if (stdout.includes('TTL=')) {
        colorLog('✅ Basic connectivity successful', colors.green);
      } else {
        colorLog('⚠️  Ping test inconclusive (may be blocked by firewall)', colors.yellow);
      }
    } catch (error) {
      colorLog('❌ Ping test failed - this may be normal for MongoDB servers', colors.yellow);
    }
    
  } catch (error) {
    colorLog(`Network test error: ${error.message}`, colors.red);
  }
}

async function runAllTests() {
  colorLog('🚀 MongoDB Atlas Connection Diagnostic Tool', colors.cyan);
  colorLog('='.repeat(50), colors.cyan);
  
  // Test network connectivity first
  await testNetworkConnectivity();
  
  // Test different connection approaches
  const tests = [
    { uri: MONGODB_ATLAS_URI, label: 'SRV Connection String', timeout: 15000 },
    { uri: MONGODB_ATLAS_URI, label: 'SRV with Extended Timeout', timeout: 30000 },
    // Note: Standard connection would need actual replica set hosts
  ];
  
  let successCount = 0;
  
  for (const test of tests) {
    const success = await testConnection(test.uri, test.label, test.timeout);
    if (success) successCount++;
  }
  
  console.log('');
  colorLog('📊 Test Results Summary', colors.cyan);
  colorLog('='.repeat(30), colors.cyan);
  colorLog(`✅ Successful connections: ${successCount}/${tests.length}`, successCount > 0 ? colors.green : colors.red);
  
  if (successCount === 0) {
    console.log('');
    colorLog('🔧 Troubleshooting Suggestions:', colors.yellow);
    console.log('');
    console.log('1. 🔒 Firewall/Network Issues:');
    console.log('   • Corporate firewall blocking port 27017');
    console.log('   • ISP blocking MongoDB connections');
    console.log('   • Antivirus software blocking connections');
    console.log('');
    console.log('2. 🌐 Try Alternative Networks:');
    console.log('   • Mobile hotspot');
    console.log('   • Different WiFi network');
    console.log('   • VPN connection');
    console.log('');
    console.log('3. 💻 Alternative Tools:');
    console.log('   • MongoDB Compass GUI');
    console.log('   • mongosh command line tool');
    console.log('   • Google Cloud Shell');
    console.log('');
    console.log('4. 🏢 If on corporate network:');
    console.log('   • Contact IT department');
    console.log('   • Request port 27017 to be opened');
    console.log('   • Use company VPN if available');
  } else {
    colorLog('🎉 Great! Your MongoDB Atlas connection is working!', colors.green);
  }
}

// Run the diagnostic
runAllTests()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Diagnostic failed:', error);
    process.exit(1);
  });
