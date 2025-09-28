# MongoDB Setup for Project-for-G25

This repository contains comprehensive guides and tools for setting up MongoDB connections, both locally and with cloud providers like MongoDB Atlas and Google Cloud Platform.

## 📁 Files Overview

### Core Guides
- **`MongoDB-Atlas-Guide.md`** - Complete guide for connecting to MongoDB Atlas
- **`GCP-MongoDB-Guide.md`** - Comprehensive guide for MongoDB on Google Cloud Platform
- **`.env.example`** - Environment variables template with security best practices

### Tools & Scripts
- **`test-mongodb-connection.js`** - Connection testing script with diagnostics
- **`package.json`** - Node.js dependencies (if not already present)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install mongodb mongoose dotenv
```

### 2. Configure Environment
```bash
# Copy the environment template
copy .env.example .env

# Edit .env with your MongoDB connection details
notepad .env
```

### 3. Test Your Connection
```bash
# Run the connection test script
node test-mongodb-connection.js
```

## 📖 Setup Options

Choose the setup method that best fits your needs:

### Option A: MongoDB Atlas (Recommended for beginners)
1. Follow the **MongoDB-Atlas-Guide.md**
2. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com/)
3. Configure your `.env` file with the Atlas connection string
4. Test the connection

### Option B: Self-hosted on Google Cloud Platform
1. Follow the **GCP-MongoDB-Guide.md**
2. Set up a VM instance on Google Cloud
3. Install and configure MongoDB
4. Configure your `.env` file with the VM connection details
5. Test the connection

### Option C: MongoDB on Google Kubernetes Engine
1. Follow the GKE section in **GCP-MongoDB-Guide.md**
2. Deploy MongoDB using Kubernetes StatefulSets
3. Configure your application to connect to the Kubernetes service

## 🔧 Configuration

### Environment Variables
Your `.env` file should contain:

```bash
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/database?retryWrites=true&w=majority
MONGODB_DB_NAME=your_database_name

# Application settings
NODE_ENV=development
PORT=3000
```

See `.env.example` for all available configuration options.

## 🧪 Testing Your Setup

The included test script will:
- ✅ Test database connection
- ✅ Verify read/write operations
- ✅ Check server information
- ✅ Test advanced features (indexing, aggregation)
- ✅ Run performance benchmarks

Run the test:
```bash
npm run test:connection
```

## 🔒 Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong passwords** for database users
3. **Enable IP whitelisting** in MongoDB Atlas
4. **Use SSL/TLS encryption** for all connections
5. **Limit database user permissions** to minimum required
6. **Rotate credentials regularly**

## 📚 Additional Resources

### MongoDB Atlas
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Atlas Security Best Practices](https://docs.atlas.mongodb.com/security/)
- [Connection String Format](https://docs.mongodb.com/manual/reference/connection-string/)

### Google Cloud Platform
- [GCP MongoDB Solutions](https://cloud.google.com/mongodb)
- [Compute Engine Documentation](https://cloud.google.com/compute/docs)
- [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/docs)

### MongoDB Drivers
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)
- [Mongoose ODM](https://mongoosejs.com/)

## 🆘 Troubleshooting

### Common Issues

1. **Connection Timeout**
   ```
   Error: MongoServerSelectionError
   ```
   - Check internet connection
   - Verify connection string
   - Ensure IP is whitelisted (Atlas)
   - Check firewall settings

2. **Authentication Failed**
   ```
   Error: MongoAuthenticationError
   ```
   - Verify username and password
   - Check user permissions
   - Ensure authentication database is correct

3. **Network Issues**
   ```
   Error: ENOTFOUND
   ```
   - Check DNS resolution
   - Verify hostname in connection string
   - Test network connectivity

### Getting Help

1. **Check the guides**: Most issues are covered in the detailed guides
2. **Run diagnostics**: Use `test-mongodb-connection.js` for detailed error info
3. **Check logs**: Review MongoDB Atlas/GCP logs for additional details
4. **Community support**: 
   - [MongoDB Community Forums](https://community.mongodb.com/)
   - [Stack Overflow](https://stackoverflow.com/questions/tagged/mongodb)

## 📋 Deployment Checklist

### Development Setup
- [ ] Dependencies installed
- [ ] `.env` file configured
- [ ] Connection test passed
- [ ] Basic CRUD operations working

### Production Setup
- [ ] Production database created
- [ ] Security hardening applied
- [ ] Backup strategy implemented
- [ ] Monitoring configured
- [ ] Performance optimized
- [ ] Error handling implemented

## 🤝 Contributing

If you find issues or have improvements:
1. Update the relevant guide
2. Test your changes
3. Update this README if needed
4. Document any new configuration options

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For project-specific questions, refer to the comprehensive guides included in this repository. For MongoDB-specific issues, consult the official MongoDB documentation and community resources.
