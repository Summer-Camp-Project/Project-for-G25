# MongoDB Atlas Setup Guide for EthioHeritage360

This guide will help you set up MongoDB Atlas as your production database for the EthioHeritage360 application.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account or log in to your existing account
3. Create a new project named "EthioHeritage360"

## Step 2: Create a Cluster

1. Click "Build a Database"
2. Choose "M0 Sandbox" (FREE tier) for development/testing
   - For production, consider M10+ for better performance
3. Select your preferred cloud provider and region (choose closest to your users)
4. Name your cluster: `ethioheritage360-cluster`
5. Click "Create Cluster"

## Step 3: Configure Database Access

### Create Database User
1. Go to "Database Access" in the sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication method
4. Username: `ethioheritage360-user`
5. Password: Generate a secure password and save it
6. Database User Privileges: Select "Read and write to any database"
7. Click "Add User"

### Configure Network Access
1. Go to "Network Access" in the sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add specific IP addresses or use Netlify's IP ranges
4. Click "Confirm"

## Step 4: Get Connection String

1. Go to "Database" in the sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `myFirstDatabase` with `ethioheritage360`

Your connection string should look like:
```
mongodb+srv://ethioheritage360-user:<password>@ethioheritage360-cluster.xxxxx.mongodb.net/ethioheritage360?retryWrites=true&w=majority
```

## Step 5: Configure Environment Variables

Add the following environment variables to your Netlify site settings:

### In Netlify Dashboard:
1. Go to your site dashboard
2. Navigate to "Site settings" > "Environment variables"
3. Add the following variables:

```
MONGODB_URI=mongodb+srv://ethioheritage360-user:<password>@ethioheritage360-cluster.xxxxx.mongodb.net/ethioheritage360?retryWrites=true&w=majority
DB_NAME=ethioheritage360
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
JWT_REFRESH_SECRET=your-super-secure-refresh-token-secret
BCRYPT_SALT_ROUNDS=12
```

## Step 6: Database Collections

The application will automatically create the following collections:
- `users` - User accounts and profiles
- `museums` - Museum information and settings
- `artifacts` - Artifact catalog and details
- `tours` - Virtual tour data
- `bookings` - Tour bookings and reservations
- `messages` - Chat messages and communications
- `notifications` - System notifications
- `educational_content` - Learning materials and courses
- `progress_tracking` - User learning progress
- `community_posts` - Community forum posts
- `collections` - User collections and bookmarks

## Step 7: Seed Initial Data (Optional)

To populate your database with initial data:

1. Set up your environment variables locally
2. Run the seeding script:
```bash
cd server
npm run seed:prod
```

## Security Best Practices

1. **Use Strong Passwords**: Generate complex passwords for database users
2. **IP Whitelisting**: In production, whitelist only necessary IP addresses
3. **Regular Backups**: Set up automated backups in MongoDB Atlas
4. **Monitor Access**: Use MongoDB Atlas monitoring to track database usage
5. **Rotate Credentials**: Regularly update database passwords and JWT secrets

## Monitoring and Maintenance

### MongoDB Atlas Features:
- **Performance Advisor**: Identifies slow operations
- **Real-time Monitoring**: Track database metrics
- **Automated Backups**: Point-in-time recovery
- **Alerts**: Set up notifications for issues

### Production Considerations:
- **Scaling**: Monitor your cluster and upgrade when needed
- **Indexing**: Optimize queries with proper indexes
- **Connection Pooling**: Configure connection limits appropriately
- **Data Archiving**: Set up data retention policies

## Troubleshooting

### Common Issues:

1. **Connection Timeout**
   - Check IP whitelist settings
   - Verify connection string format
   - Ensure network connectivity

2. **Authentication Failed**
   - Verify username and password
   - Check user privileges
   - Ensure correct database name

3. **SSL Connection Issues**
   - MongoDB Atlas requires SSL connections
   - Ensure your Node.js version supports modern SSL

### Support Resources:
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/)
- [Community Forums](https://community.mongodb.com/)

## Cost Optimization

### Free Tier Limits (M0 Sandbox):
- 512 MB storage
- Shared CPU
- No backups
- Limited connections

### Upgrade Considerations:
- M10 ($57/month): Dedicated CPU, automated backups
- M20 ($115/month): Better performance, more storage
- M30+ ($185+/month): Enhanced performance and features

Choose based on your application's needs and expected traffic.
