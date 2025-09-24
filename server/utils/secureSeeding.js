const crypto = require('crypto');
const bcrypt = require('bcryptjs');

/**
 * Generates a secure random password
 * @param {number} length - Password length (default: 16)
 * @returns {string} Generated password
 */
const generateSecurePassword = (length = 16) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one of each character type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
  password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Special char
  
  // Fill rest with random characters
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Gets admin credentials from environment or generates secure defaults
 * @returns {Object} Admin credentials
 */
const getAdminCredentials = () => {
  const email = process.env.SUPER_ADMIN_EMAIL || 'admin@ethioheritage360.com';
  let password = process.env.SUPER_ADMIN_PASSWORD;
  let isGenerated = false;
  
  if (!password) {
    password = generateSecurePassword(16);
    isGenerated = true;
  }
  
  return { email, password, isGenerated };
};

/**
 * Validates password strength
 * @param {string} password 
 * @returns {Object} Validation result
 */
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const isValid = password.length >= minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  
  return {
    isValid,
    errors: [
      ...(password.length < minLength ? [`Password must be at least ${minLength} characters long`] : []),
      ...(!hasUpper ? ['Password must contain at least one uppercase letter'] : []),
      ...(!hasLower ? ['Password must contain at least one lowercase letter'] : []),
      ...(!hasNumber ? ['Password must contain at least one number'] : []),
      ...(!hasSpecial ? ['Password must contain at least one special character'] : [])
    ]
  };
};

/**
 * Creates a secure user object with environment variables
 * @param {Object} baseUser - Base user data
 * @param {string} envEmailKey - Environment variable key for email
 * @param {string} envPasswordKey - Environment variable key for password
 * @returns {Object} Secure user object
 */
const createSecureUser = (baseUser, envEmailKey, envPasswordKey) => {
  const email = process.env[envEmailKey] || baseUser.email;
  let password = process.env[envPasswordKey];
  let isGenerated = false;
  
  if (!password) {
    password = generateSecurePassword(12);
    isGenerated = true;
    console.warn(`⚠️  No ${envPasswordKey} found in environment. Generated secure password for ${email}`);
  } else {
    const validation = validatePassword(password);
    if (!validation.isValid) {
      console.warn(`⚠️  Password for ${email} doesn't meet security requirements:`, validation.errors);
      console.warn(`⚠️  Consider using a stronger password or let the system generate one.`);
    }
  }
  
  return {
    ...baseUser,
    email,
    password,
    _isGeneratedPassword: isGenerated
  };
};

/**
 * Logs credential information securely - saves to local file for team access
 * @param {Array} users - Array of users with credentials
 */
const logCredentialsSafely = (users) => {
  const fs = require('fs');
  const path = require('path');

  // Flag to optionally show passwords in console (for team-only use)
  const showPasswords = ['true', '1', 'yes'].includes(
    (process.env.SEED_SHOW_PASSWORDS || '').toLowerCase()
  );
  
  // Create seed-outputs directory if it doesn't exist
  const outputDir = path.join(__dirname, '..', 'seed-outputs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Generate timestamp and filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const credentialsFile = path.join(outputDir, `team-credentials-${timestamp}.txt`);
  const latestFile = path.join(outputDir, `team-credentials-LATEST.txt`);
  
  // Build credentials content
  let content = '';
  content += '\n' + '='.repeat(80) + '\n';
  content += '🔐 ETHIOHERITAGE360 - TEAM LOGIN CREDENTIALS\n';
  content += '='.repeat(80) + '\n';
  content += `Generated: ${new Date().toLocaleString()}\n`;
  content += `Database: ethioheritage360\n`;
  content += '='.repeat(80) + '\n\n';
  
  let generatedCount = 0;
  let envBasedCount = 0;
  
  users.forEach((user, index) => {
    content += `${index + 1}. ${user.name || `${user.firstName} ${user.lastName}`}\n`;
    content += `   Email: ${user.email}\n`;
    content += `   Role: ${user.role.toUpperCase()}\n`;
    
    if (user._isGeneratedPassword) {
      content += `   Password: ${user.password}\n`;
      content += `   🔑 AUTO-GENERATED - Change after first login!\n`;
      generatedCount++;
    } else {
      const envInfo = `ENV VAR: ${user.email.toUpperCase().replace(/[^A-Z0-9]/g,'_')}_PASSWORD`;
      content += `   Password: [Set via environment variable]\n`;
      content += `   ℹ️  ${envInfo} (or see .env if set)\n`;
      envBasedCount++;
    }
    content += '\n' + '-'.repeat(50) + '\n\n';
  });
  
  content += '\n' + '='.repeat(80) + '\n';
  content += '🔒 IMPORTANT SECURITY NOTES:\n';
  content += '='.repeat(80) + '\n';
  content += '• This file contains sensitive credentials - DO NOT share publicly\n';
  content += '• Change all auto-generated passwords after first login\n';
  content += '• Use environment variables for production deployments\n';
  content += '• This file is automatically ignored by Git\n';
  content += '• Delete this file after all team members have their credentials\n\n';
  
  content += '📋 HOW TO LOGIN:\n';
  content += '-'.repeat(40) + '\n';
  content += '1. Start the server: npm run dev\n';
  content += '2. Visit: http://localhost:3000/login\n';
  content += '3. Use email and password from above\n';
  content += '4. Change password in your profile settings\n\n';
  
  content += '🚨 TROUBLESHOOTING:\n';
  content += '-'.repeat(40) + '\n';
  content += '• If login fails, ensure the server is running\n';
  content += '• Check MongoDB connection in server logs\n';
  content += '• Verify role permissions in admin panel\n';
  content += '• Contact system admin if issues persist\n\n';
  
  content += '='.repeat(80) + '\n';
  
  // Write to file
  try {
    fs.writeFileSync(credentialsFile, content, 'utf8');
    fs.writeFileSync(latestFile, content, 'utf8');

    // Also write a minimal Markdown file with only email/password
    const mdTimestampFile = path.join(outputDir, `autintiation-${timestamp}.md`);
    const mdLatestFile = path.join(outputDir, `autintiation.md`);

    let md = '';
    md += `# Team Credentials (Email & Password)\n\n`;
    md += `Generated: ${new Date().toLocaleString()}\n\n`;
    md += `> Note: This file is local-only and ignored by Git.\n`;
    if (!showPasswords) {
      md += `> Passwords are hidden by default. To show them, run: npm run seed:team (or npm run db:seed:team) on Windows PowerShell.\n\n`;
    } else {
      md += `> Passwords were displayed because SEED_SHOW_PASSWORDS=true.\n\n`;
    }
    md += `| # | Email | Password | Role |\n`;
    md += `|---|-------|----------|------|\n`;
    users.forEach((user, idx) => {
      let pass;
      if (showPasswords) {
        if (user._isGeneratedPassword) {
          pass = user.password; // Show generated password
        } else {
          pass = user.password || '[Set in env]'; // Show env password if available
        }
      } else {
        pass = '[Hidden - run npm run seed:team to show]'; // Hide password
      }
      md += `| ${idx + 1} | ${user.email} | ${pass} | ${user.role} |\n`;
    });
    md += `\n\nAlso see detailed file: team-credentials-LATEST.txt in this same folder.\n`;

    fs.writeFileSync(mdTimestampFile, md, 'utf8');
    fs.writeFileSync(mdLatestFile, md, 'utf8');
    
    // Console output - optionally show/hide passwords
    console.log('\n' + '='.repeat(60));
    console.log('🔐 USER CREDENTIALS GENERATED');
    console.log('='.repeat(60));
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name || `${user.firstName} ${user.lastName}`}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      
      if (showPasswords) {
        const passText = user._isGeneratedPassword ? `${user.password} (AUTO-GENERATED)` : '[From environment variable - see .env]';
        console.log(`   Password: ${passText}`);
      } else {
        if (user._isGeneratedPassword) {
          console.log(`   Password: [AUTO-GENERATED - See credentials file]`);
        } else {
          console.log(`   Password: [From environment variable]`);
        }
      }
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('📄 CREDENTIALS FILES SAVED:');
    console.log(`   Minimal MD:  ${mdLatestFile}`);
    console.log(`   Latest TXT:  ${latestFile}`);
    console.log(`   Archived:    ${credentialsFile}`);
    console.log(`   Generated passwords: ${generatedCount}`);
    console.log(`   Environment-based: ${envBasedCount}`);
    if (!showPasswords) {
      console.log('\n🔒 SECURITY: Passwords are hidden from console output');
      console.log('   To print passwords in console for team setup:');
      console.log('   - Linux/macOS: SEED_SHOW_PASSWORDS=true npm run seed');
      console.log('   - Windows PowerShell: $env:SEED_SHOW_PASSWORDS = "true"; npm run seed');
      console.log('   Or use: npm run seed:team');
    }
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('❌ Error writing credentials file:', error.message);
    console.log('\n⚠️  FALLBACK: Displaying credentials in console (LESS SECURE)');
    
    // Fallback to console display if file writing fails
    console.log('\n' + '='.repeat(60));
    console.log('🔐 USER CREDENTIALS (FALLBACK)');
    console.log('='.repeat(60));
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name || `${user.firstName} ${user.lastName}`}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      
      if (user._isGeneratedPassword) {
        console.log(`   Password: ${user.password} (AUTO-GENERATED)`);
      } else {
        console.log(`   Password: [From environment variable]`);
      }
    });
    
    console.log('='.repeat(60) + '\n');
  }
};

module.exports = {
  generateSecurePassword,
  getAdminCredentials,
  validatePassword,
  createSecureUser,
  logCredentialsSafely
};
