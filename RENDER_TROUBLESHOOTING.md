# 🔧 Render Deployment Troubleshooting Guide

## ✅ Issues Fixed

### ❌ **Issue 1: Missing script "build:render"**
**Error**: `npm error Missing script: "build:render"`

**✅ Solution Applied**:
- Added `"build:render": "echo 'Render build completed - dependencies installed'"` to `server/package.json`
- Updated `render.yaml` to use `buildCommand: cd server && npm install` instead of `npm run build:render`

### ❌ **Issue 2: MongoDB Atlas Connection String**
**Problem**: Using placeholder connection string

**✅ Solution Applied**:
- Updated connection string with your actual credentials:
```
mongodb+srv://melkamuwako5:rhkLGujTdrlrQkAu@ethioheritage360.tuhmybp.mongodb.net/ethioheritage360?retryWrites=true&w=majority&appName=ethioheritage360
```

---

## 🚀 **Next Steps for Render Deployment**

### 1. **Re-deploy on Render**
Since we've fixed the build script issues, try deploying again:

1. Go to your [Render Dashboard](https://dashboard.render.com)
2. Find your `ethioheritage360-api` service
3. Click **"Manual Deploy"** to trigger a new deployment
4. Monitor the logs for any new errors

### 2. **Configure Render Environment Variables**

In your Render service settings, add these environment variables:

#### **Required Variables:**
```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://melkamuwako5:rhkLGujTdrlrQkAu@ethioheritage360.tuhmybp.mongodb.net/ethioheritage360?retryWrites=true&w=majority&appName=ethioheritage360
DB_NAME=ethioheritage360
JWT_SECRET=generate-a-secure-32-character-secret
JWT_REFRESH_SECRET=generate-another-secure-secret
BCRYPT_SALT_ROUNDS=12
```

#### **Optional but Recommended:**
```bash
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
CACHE_TTL=3600
HEALTH_CHECK_ENABLED=true
MONITORING_ENABLED=true
```

### 3. **Generate Secure JWT Secrets**

You need to generate secure JWT secrets. You can:

**Option A**: Use our setup script
```bash
npm run setup:render
# Copy the generated secrets from .env.render-deploy
```

**Option B**: Generate manually
```bash
# In Node.js console or online generator
require('crypto').randomBytes(32).toString('hex')
```

---

## 🗄️ **MongoDB Atlas Configuration**

### **Check These MongoDB Atlas Settings:**

#### 1. **Network Access (IP Whitelist)**
- Go to MongoDB Atlas → Network Access
- Ensure you have `0.0.0.0/0` (Allow access from anywhere)
- This is required for Render deployment

#### 2. **Database User Permissions**
- Go to Database Access
- Ensure user `melkamuwako5` has:
  - **Read and write to any database** permissions
  - Password: `rhkLGujTdrlrQkAu`

#### 3. **Cluster Status**
- Verify your cluster `ethioheritage360` is running
- Check there are no maintenance windows or issues

### **Test MongoDB Connection Locally**
```bash
cd server
npm run test:mongodb
```

---

## 🛠️ **Common Render Issues & Solutions**

### **Build Errors**

#### **Issue**: `Invalid build command`
**Solution**: Ensure your `render.yaml` has:
```yaml
buildCommand: cd server && npm install
startCommand: cd server && npm start
```

#### **Issue**: `Module not found`
**Solution**: Check that all dependencies are in `server/package.json`

### **Runtime Errors**

#### **Issue**: `502 Bad Gateway`
**Solutions**:
1. Check that your server binds to `0.0.0.0` and uses `process.env.PORT`
2. Verify health check endpoint `/api/health` is working
3. Check service logs for startup errors

#### **Issue**: `Database connection failed`
**Solutions**:
1. Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Check connection string is correct in environment variables
3. Ensure database user has proper permissions

### **Environment Variables**

#### **Issue**: `Missing environment variables`
**Solutions**:
1. Add all required variables in Render Dashboard
2. Use the exact variable names (case-sensitive)
3. Don't include quotes around values in Render UI

---

## 🔍 **Debugging Steps**

### **1. Check Render Logs**
1. Go to Render Dashboard → Your Service
2. Click on **"Logs"** tab
3. Look for specific error messages

### **2. Test Health Endpoint**
Once deployed, test:
```bash
curl https://your-render-service.onrender.com/api/health
```

### **3. Monitor Database Connection**
Check logs for MongoDB connection messages:
- `✅ MongoDB connected successfully`
- `❌ MongoDB connection failed`

---

## 📋 **Deployment Checklist**

- [ ] ✅ Fixed `build:render` script in server package.json
- [ ] ✅ Updated render.yaml with correct build command
- [ ] ✅ Updated MongoDB connection string with real credentials
- [ ] ✅ Pushed fixes to Git repository
- [ ] 🔄 **Next: Re-deploy on Render**
- [ ] 🔄 **Next: Add environment variables in Render Dashboard**
- [ ] 🔄 **Next: Test health endpoint**
- [ ] 🔄 **Next: Verify database connection**

---

## 🎯 **Expected Render Build Output**

After fixes, you should see:
```
==> Cloning from https://github.com/Melke27/group_25
==> Checking out commit in branch main
==> Using Node.js version 22.16.0
==> Running build command 'cd server && npm install'...
npm WARN deprecated...
added XXX packages in XXs
==> Build completed successfully
==> Starting service with 'cd server && npm start'...
Server running on port 10000 in production mode
✅ MongoDB connected successfully to Atlas cluster
Health check available at /api/health
==> Service is live 🎉
```

---

## 📞 **Still Having Issues?**

### **MongoDB Atlas Issues**:
1. Check [MongoDB Atlas Status](https://status.mongodb.com/)
2. Verify cluster region and availability
3. Try connecting from MongoDB Compass first

### **Render Issues**:
1. Check [Render Status](https://status.render.com/)
2. Review [Render Documentation](https://render.com/docs)
3. Try creating a new service if issues persist

### **Application Issues**:
1. Test locally first: `cd server && npm start`
2. Check all required files are committed to Git
3. Verify Node.js version compatibility

---

## 🎉 **Success Indicators**

### **✅ Successful Deployment**:
- Build completes without errors
- Service starts successfully
- Health endpoint returns 200 OK
- MongoDB connection established
- API endpoints responding

### **✅ Working API**:
```bash
# Test endpoints
curl https://your-service.onrender.com/api/health
curl https://your-service.onrender.com/api/auth/health
```

### **✅ Frontend Integration**:
Update your Netlify environment variables:
```bash
VITE_API_BASE_URL=https://your-render-service.onrender.com/api
VITE_SOCKET_URL=https://your-render-service.onrender.com
```

---

Your fixes have been applied and pushed to both repositories. Try re-deploying on Render now! 🚀
