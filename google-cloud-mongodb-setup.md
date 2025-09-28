# Google Cloud Platform + MongoDB Atlas Integration Guide

## 🌐 Overview
This guide shows you how to access your MongoDB Atlas database from Google Cloud Platform services and tools.

**Your Current MongoDB Details:**
- **Database**: `ethioheritage360`
- **Connection**: `mongodb+srv://melkamuwako5_db_user:YFweyhElTJBj5sXp@cluster0.x3jfm8p.mongodb.net/ethioheritage360?retryWrites=true&w=majority&appName=Cluster0`
- **Status**: ✅ Live with 58 collections

## 🔧 Method 1: Google Cloud Shell Access

### Step 1: Access Google Cloud Shell
1. **Open**: https://console.cloud.google.com
2. **Sign in**: With your Google account
3. **Click**: The terminal icon (>_) in the top toolbar
4. **Wait**: For Cloud Shell to initialize (takes 10-30 seconds)

### Step 2: Install MongoDB Shell in Cloud Shell
```bash
# Download MongoDB Shell for Linux
wget https://downloads.mongodb.com/compass/mongosh-2.1.1-linux-x64.tgz

# Extract the archive
tar -zxvf mongosh-2.1.1-linux-x64.tgz

# Move to system path (optional, for easier access)
export PATH=$PATH:$PWD/mongosh-2.1.1-linux-x64/bin

# Verify installation
./mongosh-2.1.1-linux-x64/bin/mongosh --version
```

### Step 3: Connect to Your MongoDB Atlas
```bash
# Connect using the full path
./mongosh-2.1.1-linux-x64/bin/mongosh "mongodb+srv://melkamuwako5_db_user:YFweyhElTJBj5sXp@cluster0.x3jfm8p.mongodb.net/ethioheritage360"

# Or if you added to PATH:
mongosh "mongodb+srv://melkamuwako5_db_user:YFweyhElTJBj5sXp@cluster0.x3jfm8p.mongodb.net/ethioheritage360"
```

### Step 4: Explore Your Database
```javascript
// Check connection
db.runCommand("ping")

// Show current database
db.getName()

// List all collections (you should see 58)
show collections

// Count documents in users collection
db.users.countDocuments()

// Get sample user data
db.users.findOne()

// Show database statistics
db.stats()

// List all collections with document counts
db.runCommand("listCollections").cursor.firstBatch.forEach(
  function(collection) {
    print(collection.name + ": " + db[collection.name].countDocuments());
  }
);
```

## 🔥 Method 2: Google Cloud Functions

### Step 1: Create a New Cloud Function
1. **Go to**: https://console.cloud.google.com/functions
2. **Click**: "Create Function"
3. **Configure**:
   - **Name**: `mongodb-atlas-connector`
   - **Region**: Choose closest to your MongoDB cluster
   - **Trigger**: HTTP
   - **Authentication**: Allow unauthenticated invocations (for testing)

### Step 2: Add Function Code
**package.json:**
```json
{
  "name": "mongodb-atlas-connector",
  "version": "1.0.0",
  "dependencies": {
    "mongodb": "^6.3.0",
    "@google-cloud/functions-framework": "^3.0.0"
  }
}
```

**index.js:**
```javascript
const { MongoClient } = require('mongodb');
const functions = require('@google-cloud/functions-framework');

const MONGODB_URI = 'mongodb+srv://melkamuwako5_db_user:YFweyhElTJBj5sXp@cluster0.x3jfm8p.mongodb.net/ethioheritage360?retryWrites=true&w=majority&appName=Cluster0';

// HTTP Cloud Function to connect to MongoDB
functions.http('mongoConnect', async (req, res) => {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('ethioheritage360');
    
    // Get database statistics
    const stats = await db.stats();
    const collections = await db.listCollections().toArray();
    
    // Count documents in some key collections
    const userCount = await db.collection('users').countDocuments();
    const museumCount = await db.collection('museums').countDocuments();
    const artifactCount = await db.collection('artifacts').countDocuments();
    
    // Response with database info
    const response = {
      status: 'Connected to MongoDB Atlas',
      database: 'ethioheritage360',
      server_info: {
        collections_total: collections.length,
        database_size_mb: (stats.dataSize / (1024 * 1024)).toFixed(2),
        storage_size_mb: (stats.storageSize / (1024 * 1024)).toFixed(2),
        indexes: stats.indexes
      },
      collections: collections.map(col => col.name),
      document_counts: {
        users: userCount,
        museums: museumCount,
        artifacts: artifactCount
      },
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({
      status: 'Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  } finally {
    await client.close();
  }
});

// Export for testing
module.exports = { mongoConnect: functions.http('mongoConnect') };
```

### Step 3: Deploy and Test
1. **Click**: "Deploy"
2. **Wait**: For deployment to complete
3. **Test**: Click the trigger URL to test connection

## 🔐 Method 3: Google Cloud Secret Manager Integration

### Step 1: Store MongoDB URI in Secret Manager
```bash
# In Google Cloud Shell
echo -n "mongodb+srv://melkamuwako5_db_user:YFweyhElTJBj5sXp@cluster0.x3jfm8p.mongodb.net/ethioheritage360?retryWrites=true&w=majority&appName=Cluster0" | gcloud secrets create mongodb-uri --data-file=-
```

### Step 2: Create Secure Cloud Function
```javascript
const { MongoClient } = require('mongodb');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const secretClient = new SecretManagerServiceClient();

async function getMongoDBUri() {
  const [version] = await secretClient.accessSecretVersion({
    name: 'projects/YOUR_PROJECT_ID/secrets/mongodb-uri/versions/latest',
  });
  return version.payload.data.toString('utf8');
}

functions.http('secureMongoConnect', async (req, res) => {
  try {
    const mongoUri = await getMongoDBUri();
    const client = new MongoClient(mongoUri);
    
    await client.connect();
    // ... rest of your MongoDB operations
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🚀 Method 4: Google Cloud Run Deployment

### Step 1: Create Dockerfile
```dockerfile
FROM node:18-slim

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080
CMD ["node", "server.js"]
```

### Step 2: Create Cloud Run Service
```javascript
// server.js
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 8080;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://melkamuwako5_db_user:YFweyhElTJBj5sXp@cluster0.x3jfm8p.mongodb.net/ethioheritage360?retryWrites=true&w=majority&appName=Cluster0';

app.get('/health', async (req, res) => {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ethioheritage360');
    const collections = await db.listCollections().toArray();
    
    res.json({
      status: 'healthy',
      database: 'connected',
      collections: collections.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 3: Deploy to Cloud Run
```bash
# Build and deploy
gcloud run deploy mongodb-service \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI="mongodb+srv://melkamuwako5_db_user:YFweyhElTJBj5sXp@cluster0.x3jfm8p.mongodb.net/ethioheritage360?retryWrites=true&w=majority&appName=Cluster0"
```

## 📊 Method 5: Google Cloud Monitoring Integration

### Step 1: Create Monitoring Dashboard
```javascript
// monitoring-function.js
const { MongoClient } = require('mongodb');
const { Monitoring } = require('@google-cloud/monitoring');

const monitoring = new Monitoring.MetricServiceClient();

functions.pubsub('mongoMonitor', async (message, context) => {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('ethioheritage360');
    const stats = await db.stats();
    
    // Send custom metrics to Google Cloud Monitoring
    const request = {
      name: monitoring.projectPath('YOUR_PROJECT_ID'),
      timeSeries: [{
        metric: {
          type: 'custom.googleapis.com/mongodb/document_count',
        },
        points: [{
          interval: {
            endTime: {
              seconds: Date.now() / 1000,
            },
          },
          value: {
            int64Value: stats.objects,
          },
        }],
      }],
    };
    
    await monitoring.createTimeSeries(request);
    console.log('Metrics sent to Cloud Monitoring');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
});
```

## 🌟 Quick Start Commands

### For Google Cloud Shell:
```bash
# 1. Access Cloud Shell: https://console.cloud.google.com
# 2. Run these commands:

# Install MongoDB Shell
wget https://downloads.mongodb.com/compass/mongosh-2.1.1-linux-x64.tgz && tar -zxvf mongosh-2.1.1-linux-x64.tgz

# Connect to your database
./mongosh-2.1.1-linux-x64/bin/mongosh "mongodb+srv://melkamuwako5_db_user:YFweyhElTJBj5sXp@cluster0.x3jfm8p.mongodb.net/ethioheritage360"

# Once connected, run:
show collections
db.users.countDocuments()
db.stats()
```

## 🎯 Recommended Approach

1. **Start with Google Cloud Shell** - Easiest and immediate access
2. **Create a Cloud Function** - For programmatic access
3. **Use Secret Manager** - For production security
4. **Deploy Cloud Run** - For scalable applications

Your MongoDB Atlas database is fully compatible with all Google Cloud services and can be accessed securely from the cloud environment!
