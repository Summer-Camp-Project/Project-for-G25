
# 📋 Render Deployment Checklist for EthioHeritage360

## Pre-Deployment
- [ ] MongoDB Atlas cluster created and configured
- [ ] Render account created at render.com
- [ ] Git repository pushed to GitHub/GitLab
- [ ] All tests passing locally: `cd server && npm test`
- [ ] Build process working: `cd server && npm run build`

## Render Service Setup
- [ ] New Web Service created on Render
- [ ] Repository connected to Render
- [ ] Build settings configured:
  - Root Directory: server
  - Build Command: npm install && npm run build
  - Start Command: npm start
  - Runtime: Node

## Environment Variables (Copy from .env.render-deploy)
- [ ] NODE_ENV=production
- [ ] PORT=10000
- [ ] MONGODB_URI (from MongoDB Atlas)
- [ ] JWT_SECRET (generated)
- [ ] JWT_REFRESH_SECRET (generated)
- [ ] BCRYPT_SALT_ROUNDS=12
- [ ] DB_NAME=ethioheritage360
- [ ] ALLOWED_ORIGINS (your Netlify URL)
- [ ] Other optional variables as needed

## Database Configuration
- [ ] MongoDB Atlas IP whitelist configured (0.0.0.0/0 for Render)
- [ ] Database user has read/write permissions
- [ ] Connection string tested and working

## Testing and Verification
- [ ] Service deployed successfully on Render
- [ ] Health check endpoint working: https://your-service.onrender.com/api/health
- [ ] Database connection established (check logs)
- [ ] API endpoints responding correctly
- [ ] CORS working with frontend

## Frontend Integration
- [ ] Update Netlify environment variables:
  - VITE_API_BASE_URL=https://your-render-service.onrender.com/api
  - VITE_SOCKET_URL=https://your-render-service.onrender.com
- [ ] Test frontend-backend integration
- [ ] Authentication flow working end-to-end

## Optional Enhancements
- [ ] Custom domain configured
- [ ] SSL certificate active (automatic with Render)
- [ ] Monitoring and alerts configured
- [ ] Backup procedures documented
- [ ] Performance optimized

## Production Readiness
- [ ] All API endpoints tested
- [ ] File uploads working (if using Cloudinary)
- [ ] Email notifications working (if configured)
- [ ] Real-time features working (WebSocket/Socket.IO)
- [ ] Error handling and logging working
- [ ] Security headers configured

---

🎉 Your EthioHeritage360 backend will be live at: https://your-render-service.onrender.com

**Need help?**
- RENDER_DEPLOYMENT_GUIDE.md for detailed instructions
- DATABASE_SETUP.md for MongoDB Atlas configuration
- Render documentation: https://render.com/docs
