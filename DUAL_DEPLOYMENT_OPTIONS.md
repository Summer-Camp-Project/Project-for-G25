
# 🌟 Dual Deployment Architecture

Your EthioHeritage360 application now supports two deployment options:

## Option 1: Full Netlify (Recommended for simplicity)
- Frontend: Netlify (React app)
- Backend: Netlify Functions (Serverless)
- Database: MongoDB Atlas
- Files: Netlify Large Media or Cloudinary

## Option 2: Netlify + Render (Recommended for scalability)
- Frontend: Netlify (React app) 
- Backend: Render (Node.js server)
- Database: MongoDB Atlas
- Files: Cloudinary

## Configuration Files Created:
- netlify.toml - Netlify configuration
- render.yaml - Render service configuration
- .env.netlify - Netlify environment variables
- .env.render - Render environment variables
- netlify/functions/api.js - Serverless function handler
- server/Dockerfile.render - Docker configuration for Render

## Deployment Scripts Added:
- npm run build:netlify - Build for Netlify
- npm run deploy:netlify - Deploy to Netlify
- npm run build:render - Build for Render
- npm run setup:render - Setup Render deployment

Choose the deployment option that best fits your needs!
