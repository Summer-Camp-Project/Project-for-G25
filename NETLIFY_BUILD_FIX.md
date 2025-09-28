# 🔧 Netlify Build Error Fix Guide

## ❌ **Current Issue:**
```
Production: main@af7a908 failed
Failed during stage 'building site': Build script returned non-zero exit code: 2
```

## ✅ **Fixes Applied:**

### 1. **Simplified Build Command**
- **Old**: `npm run build:netlify` (complex workspace setup)
- **New**: `cd client && npm install && npm run build` (direct approach)

### 2. **Updated netlify.toml**
```toml
[build]
  base = "."
  publish = "client/dist"
  command = "cd client && npm install && npm run build"
```

### 3. **Added Backup Build Script**
- Created `netlify-build.sh` with error handling
- Alternative command: `bash netlify-build.sh`

---

## 🚀 **Deploy Options:**

### **Option 1: Use Netlify Dashboard (Recommended)**
1. Go to your Netlify site dashboard
2. Go to "Site Settings" → "Build & Deploy"
3. Update build settings:
   - **Build command**: `cd client && npm install && npm run build`
   - **Publish directory**: `client/dist`
   - **Base directory**: (leave empty)

### **Option 2: Deploy After This Push**
The updated `netlify.toml` should fix the build automatically on next deploy.

---

## 🔍 **Common Netlify Build Issues & Solutions:**

### **Issue 1: Workspace Dependencies**
**Problem**: NPM workspaces can cause issues in Netlify
**Solution**: Direct build in client directory

### **Issue 2: Missing Dependencies**
**Problem**: Dependencies not installed properly
**Solution**: Use `npm install` instead of `npm ci`

### **Issue 3: Node Version Mismatch**
**Problem**: Different Node versions between local and Netlify
**Solution**: Set `NODE_VERSION = "18"` in netlify.toml

### **Issue 4: Build Script Errors**
**Problem**: Complex build scripts fail
**Solution**: Simplify to basic commands

---

## 🛠️ **Build Commands Explained:**

### **Current Build Process:**
```bash
# 1. Navigate to client directory
cd client

# 2. Install dependencies
npm install

# 3. Build React app
npm run build

# 4. Output goes to client/dist
# 5. Netlify serves from client/dist
```

### **What Gets Built:**
- React frontend → Static files in `client/dist`
- Netlify Functions → `netlify/functions/` (separate process)

---

## 🔄 **Alternative Build Commands:**

If the current fix doesn't work, try these in Netlify dashboard:

### **Option A: Direct Vite Build**
```bash
cd client && npm install && npx vite build
```

### **Option B: Clean Install**
```bash
cd client && rm -rf node_modules && npm install && npm run build
```

### **Option C: Use Build Script**
```bash
bash netlify-build.sh
```

---

## 📊 **Netlify Environment Variables:**

Make sure these are set in Netlify Dashboard:

### **Build Environment:**
```bash
NODE_VERSION=18
NPM_VERSION=8
NODE_ENV=production
```

### **Function Environment:**
```bash
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

---

## 🧪 **Test Build Locally:**

Before pushing, test the build locally:

```bash
# Test the exact Netlify build command
cd client && npm install && npm run build

# Check if dist directory is created
ls -la client/dist

# Verify index.html exists
ls client/dist/index.html
```

---

## 📋 **Netlify Build Checklist:**

- [ ] ✅ Updated netlify.toml with direct build command
- [ ] ✅ Simplified build script in package.json
- [ ] ✅ Created backup build script (netlify-build.sh)
- [ ] 🔄 **Next**: Push changes to Git
- [ ] 🔄 **Next**: Monitor Netlify build logs
- [ ] 🔄 **Next**: If still failing, try alternative build commands

---

## 🚨 **If Build Still Fails:**

### **Check Build Logs:**
1. Go to Netlify Dashboard
2. Click on failed deploy
3. View detailed build logs
4. Look for specific error messages

### **Common Error Messages:**

#### **"Module not found"**
- Missing dependency in client/package.json
- Run: `npm install <missing-package>`

#### **"Command failed"**
- Build script error in client
- Check client/package.json scripts

#### **"ENOENT: no such file"**
- Missing file reference
- Check import paths in React components

#### **"Out of memory"**
- Large build process
- Try: Split builds or optimize bundle size

---

## 🔧 **Manual Deploy (Backup Option):**

If automatic builds keep failing:

```bash
# Build locally
npm run build:netlify

# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify deploy --prod --dir=client/dist
```

---

## 🎯 **Expected Success Output:**

After fix, you should see:
```
🚀 Starting build
📦 Installing dependencies
🏗️ Building site
✅ Build succeeded
🌐 Site deployed
```

---

Your Netlify build should now work! The simplified build command avoids workspace complications and directly builds the client. 🚀
