# 🔐 EthioHeritage360 - Team Login Guide

## 📋 Quick Start for Team Members

### 🚀 Step 1: Get Your Credentials

**🎯 FASTEST WAY (Shows passwords on screen for team setup):**
```powershell
# Windows PowerShell - Run from project root:
npm run db:seed:team

# OR from server folder:
cd server
npm run seed:team
```

**🔒 SECURE WAY (Passwords hidden, saved to file only):**
```powershell
npm run db:seed
```

**📁 Find your credentials files:**
- **Minimal list (Email & Password only)**: `server/seed-outputs/autintiation.md`
- **Latest detailed**: `server/seed-outputs/team-credentials-LATEST.txt` (always has newest)
- **Archive detailed**: `server/seed-outputs/team-credentials-[timestamp].txt` (date-stamped)
- **⚠️ Keep these files secure - they're not tracked in Git**

### 🏛️ Step 2: Museum Admin Login

**Museum Admin Credentials** (from credentials file):
- **Email**: `museum.admin@ethioheritage360.com` 
- **Role**: `MUSEUMADMIN`
- **Password**: [Check your credentials file]

**Login Process**:
1. Start the servers:
   ```bash
   npm run dev
   ```
2. Visit: http://localhost:3000/login
3. Use the email and password from your credentials file
4. **Change your password immediately** in profile settings

### 🔧 Step 3: API Testing (for developers)

**Test Museum Admin Authentication**:
```bash
# Login request
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "museum.admin@ethioheritage360.com",
    "password": "YOUR_PASSWORD_FROM_FILE"
  }'

# Use the returned token for authenticated requests
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 👥 All Team Roles & Access

### 🛡️ Super Admins
1. **Melkamu Wako** - `melkamuwako5@admin.com`
2. **Abdurazak M** - `abdurazakm343@admin.com`
3. **Student Pasegid** - `student.pasegid@admin.com`
4. **Naol Aboma** - `naolaboma@admin.com`

### 🏛️ Museum Admin
5. **National Museum Admin** - `museum.admin@ethioheritage360.com`

### 👤 Test Users
6. **Heritage Tours Ethiopia** - `organizer@heritagetours.et`
7. **Tour Guide Demo** - `tourguide@demo.com`
8. **Test User** - `test@example.com`

**🔑 All passwords are in the credentials file: `server/seed-outputs/team-credentials-[timestamp].txt`**

## 🚨 Troubleshooting

### ❌ Museum Admin Login Fails

**Check these common issues**:

1. **Wrong credentials**:
   ```powershell
   # Re-run seeding with visible passwords (team setup)
   npm run db:seed:team
   
   # OR secure way (check credentials file)
   npm run db:seed
   ```

2. **Server not running**:
   ```bash
   # Start both frontend and backend
   npm run dev
   ```

3. **Role permissions issue**:
   ```bash
   # Check user role in database
   curl -X GET http://localhost:5000/api/auth/me \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

4. **Database connection**:
   ```bash
   # Test database connection
   npm run health:check
   ```

### 🔍 Debug Login Issues

**Enable debug logging**:
```bash
# In server/.env, add:
DEBUG_MODE=true
LOG_LEVEL=debug

# Restart server and check logs
npm run dev
```

**Check server logs** for authentication errors:
- Look for `[ADMIN ACTION]` logs
- Check for JWT token errors
- Verify role validation messages

### 📊 Verify Admin Access

**Test admin endpoints**:
```bash
# Get current user info
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Should return:
# {
#   "success": true,
#   "user": {
#     "role": "museumAdmin",
#     "email": "museum.admin@ethioheritage360.com",
#     ...
#   }
# }
```

## 🛠️ Environment Setup

### 📁 Required Files

1. **server/.env** - Database and JWT configuration
2. **client/.env** - API URL configuration  
3. **server/seed-outputs/team-credentials-[timestamp].txt** - Login credentials

### 🐳 Docker Setup (Alternative)

```bash
# Start with Docker Compose
npm run docker:dev

# Access services:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB UI: http://localhost:8081
```

## ⚡ Quick Commands

```bash
# Start everything
npm run dev

# Reset database and get new credentials
cd server && npm run clean-db && npm run seed

# Run health check
npm run health:check

# View server logs
npm run logs:tail

# Stop all services
npm run docker:down
```

## 🔒 Security Notes

- **Never commit** the credentials file to Git (it's automatically ignored)
- **Change generated passwords** after first login
- **Use strong passwords** for production
- **Keep credentials file secure** and delete after team setup
- **Environment variables** override generated passwords

## 📞 Support

If you have issues:

1. **Check credentials file** first
2. **Verify services are running** (`npm run dev`)
3. **Run health check** (`npm run health:check`)
4. **Check server logs** for error messages
5. **Contact system admin** if problems persist

---
LOGIN CREDENTIALS ===
1. melkamuwako5@admin.com / melkamuwako5');
2. abdurazakm343@admin.com / THpisvaHUbQNMsbX');
3. student.pasegid@admin.com / Fs4HwlXCW4SJvkyN')
4. naolaboma@admin.com / QR7ICwI5s6VMgAZD');
 5. museum.admin@ethioheritage360.com / museum123');
 6. organizer@heritagetours.et / organizer123');
 7. tourguide@demo.com / tourguide123');
8. test@example.com / test123456');
  