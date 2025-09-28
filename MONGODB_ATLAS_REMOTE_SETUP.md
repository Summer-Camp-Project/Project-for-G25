# 🌐 MongoDB Atlas Remote Database Setup Guide

## 🎯 **Your Database Configuration**

### **✅ Current Setup:**
- **Username**: `melkamuwako5`
- **Password**: `rhkLGujTdrlrQkAu`
- **Cluster**: `ethioheritage360.tuhmybp.mongodb.net`
- **Database**: `ethioheritage360`

### **🔗 Connection String:**
```
mongodb+srv://melkamuwako5:rhkLGujTdrlrQkAu@ethioheritage360.tuhmybp.mongodb.net/ethioheritage360?retryWrites=true&w=majority&appName=ethioheritage360
```

---

## 🚀 **Step-by-Step Setup**

### **Step 1: Verify MongoDB Atlas Access**

1. **Login to MongoDB Atlas**
   - Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
   - Login with your MongoDB account

2. **Check Your Cluster**
   - Navigate to "Database" → "Clusters"
   - Verify `ethioheritage360` cluster is running
   - Status should be "Active" ✅

### **Step 2: Configure Network Access**

1. **Go to Network Access**
   - Left sidebar → "Network Access"

2. **Add IP Address**
   - Click "ADD IP ADDRESS"
   - Select "ALLOW ACCESS FROM ANYWHERE"
   - IP Address: `0.0.0.0/0`
   - Comment: "Allow all IPs for deployment"
   - Click "Confirm"

   **⚠️ Important**: This allows connections from any IP (required for Render deployment)

### **Step 3: Verify Database User**

1. **Go to Database Access**
   - Left sidebar → "Database Access"

2. **Check User Permissions**
   - Find user: `melkamuwako5`
   - Password: `rhkLGujTdrlrQkAu`
   - Role: Should be "Read and write to any database" ✅

### **Step 4: Test Connection**

Run our test script to verify everything works:

```bash
cd server
npm run test:mongodb
```

Expected output:
```
🔍 Testing MongoDB Atlas Connection...
✅ Successfully connected to MongoDB Atlas!
📊 Database: ethioheritage360
🏠 Host: ethioheritage360-shard-00-02.tuhmybp.mongodb.net
🎉 All tests passed! MongoDB Atlas is working correctly.
```

---

## 🔧 **Adding MONGODB_URI to Different Environments**

### **🌐 For Render Deployment:**

1. **Go to Render Dashboard**
   - [https://dashboard.render.com](https://dashboard.render.com)
   - Select your `ethioheritage360-api` service

2. **Add Environment Variable**
   - Go to "Environment" tab
   - Click "Add Environment Variable"
   - **Name**: `MONGODB_URI`
   - **Value**: `mongodb+srv://melkamuwako5:rhkLGujTdrlrQkAu@ethioheritage360.tuhmybp.mongodb.net/ethioheritage360?retryWrites=true&w=majority&appName=ethioheritage360`
   - Click "Save Changes"

3. **Additional Required Variables:**
```bash
NODE_ENV=production
PORT=10000
DB_NAME=ethioheritage360
JWT_SECRET=your-32-char-secret
JWT_REFRESH_SECRET=your-refresh-secret
BCRYPT_SALT_ROUNDS=12
```

### **🔵 For Netlify Functions:**

1. **Go to Netlify Dashboard**
   - [https://app.netlify.com](https://app.netlify.com)
   - Select your site

2. **Add Environment Variables**
   - Go to "Site Settings" → "Environment Variables"
   - Add:
   ```bash
   MONGODB_URI=mongodb+srv://melkamuwako5:rhkLGujTdrlrQkAu@ethioheritage360.tuhmybp.mongodb.net/ethioheritage360?retryWrites=true&w=majority&appName=ethioheritage360
   NODE_ENV=production
   DB_NAME=ethioheritage360
   JWT_SECRET=your-32-char-secret
   JWT_REFRESH_SECRET=your-refresh-secret
   ```

### **💻 For Local Development:**

Create/update your `.env` file in the server directory:

```bash
# .env file in server directory
MONGODB_URI=mongodb+srv://melkamuwako5:rhkLGujTdrlrQkAu@ethioheritage360.tuhmybp.mongodb.net/ethioheritage360?retryWrites=true&w=majority&appName=ethioheritage360
DB_NAME=ethioheritage360
NODE_ENV=development
```

---

## 🛠️ **Troubleshooting Connection Issues**

### **❌ Common Issues & Solutions:**

#### **Issue 1: Authentication Failed**
```
Error: Authentication failed
```
**Solutions:**
- Verify username: `melkamuwako5`
- Verify password: `rhkLGujTdrlrQkAu`
- Check Database Access permissions in MongoDB Atlas

#### **Issue 2: Connection Timeout**
```
Error: queryTxt ETIMEOUT
```
**Solutions:**
- Check Network Access in MongoDB Atlas
- Ensure `0.0.0.0/0` is in IP whitelist
- Verify cluster is running (not paused)

#### **Issue 3: Database Not Found**
```
Error: Database not found
```
**Solutions:**
- Database name should be: `ethioheritage360`
- MongoDB will auto-create the database on first write

#### **Issue 4: SSL Connection Issues**
```
Error: SSL connection failed
```
**Solutions:**
- MongoDB Atlas requires SSL (this is automatic)
- Connection string includes proper SSL options

---

## 🧪 **Testing Your Remote Database**

### **Test Script Commands:**

```bash
# Test MongoDB connection
cd server
npm run test:mongodb

# Test with specific environment
NODE_ENV=production npm run test:mongodb

# Health check
npm run health:check
```

### **Manual Connection Test:**

You can also test manually using MongoDB Compass:
1. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Use connection string: `mongodb+srv://melkamuwako5:rhkLGujTdrlrQkAu@ethioheritage360.tuhmybp.mongodb.net/ethioheritage360`
3. Connect and verify you can see your database

---

## 📊 **Database Collections**

Your `ethioheritage360` database should include these collections:
```
📁 Collections:
├── users              # User accounts and profiles
├── museums            # Museum information
├── artifacts          # Artifact catalog
├── tours              # Virtual tour data
├── bookings           # Tour bookings
├── messages           # Chat messages
├── notifications      # System notifications
├── educational_content # Learning materials
├── progress_tracking   # User progress
├── collections        # User collections
└── ... (and more as needed)
```

---

## 🔐 **Security Best Practices**

### **✅ Production Security:**
1. **Rotate Passwords**: Change database password monthly
2. **Monitor Access**: Check MongoDB Atlas access logs
3. **Backup**: Enable automated backups in MongoDB Atlas
4. **SSL**: Always use SSL connections (enabled by default)

### **🔒 Environment Variables Security:**
1. **Never commit**: Keep `.env` files in `.gitignore`
2. **Use secrets**: Store sensitive data in platform secret managers
3. **Rotate keys**: Change JWT secrets regularly

---

## 🚀 **Ready to Deploy!**

### **Deployment Checklist:**
- [ ] ✅ MongoDB Atlas cluster is running
- [ ] ✅ Network access configured (0.0.0.0/0)
- [ ] ✅ Database user has proper permissions
- [ ] ✅ Connection string tested locally
- [ ] 🔄 **Next**: Add MONGODB_URI to Render environment
- [ ] 🔄 **Next**: Deploy and test health endpoint
- [ ] 🔄 **Next**: Verify database connection in production

### **Test Your Deployment:**

Once deployed, verify with:
```bash
# Health check
curl https://your-render-service.onrender.com/api/health

# Should return:
{
  "status": "OK",
  "database": {
    "connected": true,
    "status": "connected"
  }
}
```

---

## 📞 **Need Help?**

### **MongoDB Atlas Support:**
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Connection Troubleshooting](https://docs.atlas.mongodb.com/troubleshoot-connection/)

### **Render Support:**
- [Render Documentation](https://render.com/docs)
- [Environment Variables Guide](https://render.com/docs/environment-variables)

### **Application Issues:**
- Check `RENDER_TROUBLESHOOTING.md` for common deployment issues
- Use `npm run test:mongodb` to diagnose connection problems

---

Your MongoDB Atlas database is ready for remote connections! 🎉
Just add the MONGODB_URI to your deployment platform and you're good to go! 🚀
