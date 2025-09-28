
# 📋 Deployment Checklist for EthioHeritage360

## Pre-Deployment
- [ ] Code committed and pushed to Git repository
- [ ] All tests passing locally
- [ ] Build process working: `npm run build:netlify`

## MongoDB Atlas Setup
- [ ] MongoDB Atlas account created
- [ ] Cluster created and configured
- [ ] Database user created with read/write permissions
- [ ] Network access configured (IP whitelist)
- [ ] Connection string obtained

## Netlify Setup
- [ ] Netlify account created
- [ ] Site connected to Git repository
- [ ] Build settings configured:
  - Base directory: (empty)
  - Build command: npm run build:netlify
  - Publish directory: client/dist
  - Functions directory: netlify/functions

## Environment Variables
Copy from .env.netlify file to Netlify Dashboard:
- [ ] NODE_ENV=production
- [ ] JWT_SECRET (generated)
- [ ] JWT_REFRESH_SECRET (generated)
- [ ] MONGODB_URI (from Atlas)
- [ ] DB_NAME=ethioheritage360
- [ ] ALLOWED_ORIGINS (your Netlify URL)
- [ ] Other optional variables as needed

## Testing
- [ ] Frontend loads at Netlify URL
- [ ] API health check: https://your-site.netlify.app/.netlify/functions/api/health
- [ ] Database connection working
- [ ] Authentication flow working
- [ ] File uploads working (if configured)

## Optional Enhancements
- [ ] Custom domain configured
- [ ] SSL certificate active (automatic with Netlify)
- [ ] Analytics enabled
- [ ] Error monitoring configured
- [ ] Performance optimization completed

## Post-Deployment
- [ ] Create initial admin user
- [ ] Test all major functionality
- [ ] Monitor logs and performance
- [ ] Set up backup procedures
- [ ] Document any custom configurations

---

🎉 Your EthioHeritage360 app will be live at: https://your-site-name.netlify.app

Need help? Check:
- DEPLOYMENT_GUIDE.md for detailed instructions
- DATABASE_SETUP.md for MongoDB Atlas configuration
- Netlify documentation: https://docs.netlify.com/
