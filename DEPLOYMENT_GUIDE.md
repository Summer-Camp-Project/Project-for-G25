# EthioHeritage360 Deployment Guide - Netlify + MongoDB Atlas

This comprehensive guide will walk you through deploying your full-stack EthioHeritage360 application to Netlify with a MongoDB Atlas database.

## 🚀 Overview

The deployment architecture includes:
- **Frontend**: React app served by Netlify CDN
- **Backend**: Serverless functions on Netlify Functions
- **Database**: MongoDB Atlas (cloud database)
- **File Storage**: Cloudinary (recommended) or Netlify Large Media

## 📋 Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- Git repository with your code
- GitHub/GitLab account (for continuous deployment)
- MongoDB Atlas account (free tier available)
- Netlify account (free tier available)

## 🎯 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Ensure all files are committed**:
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

2. **Verify your project structure**:
```
Project-for-G25/
├── client/          # React frontend
├── server/          # Express backend
├── netlify/
│   └── functions/
│       └── api.js   # Serverless API handler
├── netlify.toml     # Netlify configuration
├── .env.production  # Production environment template
└── package.json     # Root package file
```

### Step 2: Set Up MongoDB Atlas

Follow the detailed [DATABASE_SETUP.md](./DATABASE_SETUP.md) guide to:
1. Create MongoDB Atlas account
2. Set up cluster and database user
3. Configure network access
4. Get connection string

### Step 3: Deploy to Netlify

#### Option A: Deploy from Git (Recommended)

1. **Connect to Netlify**:
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub/GitLab)
   - Select your repository

2. **Configure Build Settings**:
   ```
   Base directory: (leave empty)
   Build command: npm run build:netlify
   Publish directory: client/dist
   Functions directory: netlify/functions
   ```

3. **Add Environment Variables**:
   Go to Site Settings → Environment variables and add:
   ```
   MONGODB_URI=your-mongodb-connection-string
   NODE_ENV=production
   JWT_SECRET=your-jwt-secret-32-chars-min
   JWT_REFRESH_SECRET=your-refresh-secret
   BCRYPT_SALT_ROUNDS=12
   ```

4. **Deploy**:
   - Click "Deploy site"
   - Netlify will automatically build and deploy your application

#### Option B: Manual Deploy

1. **Build locally**:
```bash
npm run build:netlify
```

2. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

3. **Login to Netlify**:
```bash
netlify login
```

4. **Deploy**:
```bash
netlify deploy --prod
```

### Step 4: Configure Domain and SSL

1. **Custom Domain** (Optional):
   - Go to Site Settings → Domain management
   - Add your custom domain
   - Follow DNS configuration instructions

2. **SSL Certificate**:
   - Automatically provided by Netlify
   - Force HTTPS in Site Settings → Domain management

### Step 5: Environment-Specific Configuration

#### Production Environment Variables

Add these essential variables in Netlify Dashboard:

```bash
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ethioheritage360
DB_NAME=ethioheritage360

# Security
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
JWT_REFRESH_SECRET=your-super-secure-refresh-token-secret
BCRYPT_SALT_ROUNDS=12

# File Upload (Cloudinary recommended)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# External Services
MAPBOX_ACCESS_TOKEN=your-mapbox-token
GOOGLE_MAPS_API_KEY=your-google-maps-key

# CORS
ALLOWED_ORIGINS=https://your-site.netlify.app,https://your-domain.com

# Email (for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FROM_EMAIL=noreply@ethioheritage360.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

### Step 6: Test Your Deployment

1. **Frontend Test**:
   - Visit your Netlify URL
   - Verify all pages load correctly
   - Test responsive design

2. **Backend API Test**:
   - Check `https://your-site.netlify.app/.netlify/functions/api/health`
   - Test authentication endpoints
   - Verify database connectivity

3. **Full Integration Test**:
   - Register a new user
   - Test login/logout
   - Create and interact with content
   - Test real-time features

## 🔧 Post-Deployment Configuration

### Monitoring and Analytics

1. **Netlify Analytics**:
   - Enable in Site Settings → Analytics
   - Monitor traffic and performance

2. **Error Tracking**:
   - Consider integrating Sentry for error monitoring
   - Add `SENTRY_DSN` environment variable

3. **Performance Monitoring**:
   - Use Netlify's built-in performance insights
   - Monitor function execution times

### Backup and Recovery

1. **Database Backups**:
   - MongoDB Atlas provides automated backups
   - Test restore procedures regularly

2. **Code Backups**:
   - Ensure your Git repository is properly backed up
   - Consider using GitHub's backup features

### Security Hardening

1. **Environment Variables**:
   - Regularly rotate JWT secrets
   - Use strong, unique passwords

2. **Database Security**:
   - Limit IP access to necessary addresses
   - Monitor database access logs

3. **HTTPS Enforcement**:
   - Ensure all traffic is HTTPS
   - Update CORS origins accordingly

## 🐛 Troubleshooting

### Common Deployment Issues

1. **Build Failures**:
```bash
# Check build logs in Netlify dashboard
# Common fixes:
npm run clean
npm run install:all
npm run build:netlify
```

2. **Function Errors**:
```bash
# Check function logs in Netlify dashboard
# Test locally:
netlify dev
```

3. **Database Connection Issues**:
   - Verify MongoDB Atlas IP whitelist
   - Check connection string format
   - Ensure environment variables are set

4. **CORS Errors**:
   - Update `ALLOWED_ORIGINS` environment variable
   - Check client-side API endpoints

### Performance Optimization

1. **Client-Side**:
   - Enable Vite build optimizations
   - Implement lazy loading for routes
   - Optimize images and assets

2. **Server-Side**:
   - Implement caching strategies
   - Optimize database queries
   - Use MongoDB indexes effectively

3. **Netlify Optimizations**:
   - Enable Netlify's asset optimization
   - Use Netlify Large Media for large files
   - Implement proper caching headers

## 📈 Scaling Considerations

### Free Tier Limits

**Netlify Free Tier**:
- 100GB bandwidth/month
- 300 build minutes/month
- 125,000 serverless function requests/month

**MongoDB Atlas Free Tier**:
- 512MB storage
- Limited connections
- No automated backups

### Upgrade Path

1. **Traffic Growth**:
   - Monitor Netlify analytics
   - Upgrade to Pro plan when needed
   - Consider CDN optimizations

2. **Database Growth**:
   - Monitor MongoDB Atlas usage
   - Upgrade cluster size as needed
   - Implement data archiving strategies

3. **Function Usage**:
   - Monitor serverless function invocations
   - Optimize cold start times
   - Consider function bundling

## 🚀 Continuous Deployment

### Auto-Deploy Setup

1. **Branch Protection**:
   - Set up branch protection rules
   - Require PR reviews for main branch

2. **Deploy Previews**:
   - Netlify automatically creates deploy previews for PRs
   - Test features before merging

3. **Environment Branches**:
   - Consider separate staging environment
   - Use different environment variables per branch

### CI/CD Pipeline

```yaml
# Example GitHub Actions workflow
name: Deploy to Netlify
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm run install:all
      - run: npm run test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm run build:netlify
      - uses: netlify/actions/deploy@master
        with:
          publish-dir: './client/dist'
          production-branch: main
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📞 Support and Resources

### Documentation
- [Netlify Documentation](https://docs.netlify.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Netlify Functions Guide](https://docs.netlify.com/functions/overview/)

### Community
- [Netlify Community](https://community.netlify.com/)
- [MongoDB Community](https://community.mongodb.com/)
- [React Community](https://reactjs.org/community/support.html)

### Tools
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [Postman](https://www.postman.com/) for API testing

---

## ✅ Deployment Checklist

- [ ] Repository prepared and pushed to Git
- [ ] MongoDB Atlas cluster created and configured
- [ ] Netlify site connected to repository
- [ ] Environment variables configured
- [ ] Build and deploy successful
- [ ] Frontend loads correctly
- [ ] API endpoints responding
- [ ] Database connectivity verified
- [ ] Authentication flow working
- [ ] File uploads configured
- [ ] Custom domain set up (optional)
- [ ] SSL certificate active
- [ ] Monitoring and analytics enabled
- [ ] Backup procedures documented
- [ ] Performance optimized

Your EthioHeritage360 application is now live! 🎉
