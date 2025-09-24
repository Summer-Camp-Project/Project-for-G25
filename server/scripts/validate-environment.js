#!/usr/bin/env node

/**
<<<<<<< HEAD
 * Environment Validation Script
 * Validates that all required environment variables are set and valid
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_ENV_VARS = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET'
];

const OPTIONAL_ENV_VARS = [
    'OPENAI_API_KEY',
    'OPENAI_API_BASE'
];

function validateEnvironment() {
    console.log('🔍 Validating environment configuration...');
    
    // Load environment variables
    require('dotenv').config();
    
    const errors = [];
    const warnings = [];
    
    // Check required environment variables
    REQUIRED_ENV_VARS.forEach(varName => {
        if (!process.env[varName]) {
            errors.push(`❌ Missing required environment variable: ${varName}`);
        } else {
            console.log(`✅ ${varName}: Set`);
        }
    });
    
    // Check optional environment variables
    OPTIONAL_ENV_VARS.forEach(varName => {
        if (!process.env[varName]) {
            warnings.push(`⚠️  Optional environment variable not set: ${varName}`);
        } else {
            console.log(`✅ ${varName}: Set`);
        }
    });
    
    // Validate specific environment variables
    if (process.env.PORT) {
        const port = parseInt(process.env.PORT);
        if (isNaN(port) || port < 1 || port > 65535) {
            errors.push(`❌ Invalid PORT value: ${process.env.PORT} (must be a number between 1-65535)`);
        }
    }
    
    if (process.env.NODE_ENV) {
        const validEnvs = ['development', 'production', 'test'];
        if (!validEnvs.includes(process.env.NODE_ENV)) {
            warnings.push(`⚠️  NODE_ENV should be one of: ${validEnvs.join(', ')}`);
        }
    }
    
    // Check if .env file exists
    const envPath = path.join(__dirname, '../.env');
    if (!fs.existsSync(envPath)) {
        warnings.push(`⚠️  .env file not found at ${envPath}`);
    }
    
    // Print warnings
    if (warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        warnings.forEach(warning => console.log(`   ${warning}`));
    }
    
    // Print errors and exit if any
    if (errors.length > 0) {
        console.log('\n❌ Environment validation failed:');
        errors.forEach(error => console.log(`   ${error}`));
        console.log('\nPlease fix the above issues before starting the server.');
        process.exit(1);
    }
    
    console.log('\n✅ Environment validation passed!');
    return true;
}

// Run validation if called directly
if (require.main === module) {
    validateEnvironment();
}

module.exports = validateEnvironment;
=======
 * Environment validation script
 * Validates that all required environment variables are set
 */

// Load environment variables from .env file
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs = require('fs');
const path = require('path');

// Required environment variables
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET'
];

// Optional but recommended environment variables
const optionalEnvVars = [
  'JWT_EXPIRE',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS'
];

console.log('🔍 Validating environment variables...\n');

let hasErrors = false;
const missingVars = [];
const warnings = [];

// Check required variables
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
    hasErrors = true;
  }
});

// Check optional variables
optionalEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    warnings.push(varName);
  }
});

// Display results
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\nPlease set these variables in your .env file or environment.');
}

if (warnings.length > 0) {
  console.warn('\n⚠️  Optional environment variables not set:');
  warnings.forEach(varName => {
    console.warn(`   - ${varName}`);
  });
  console.warn('\nThese are recommended for full functionality.');
}

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.warn('\n⚠️  No .env file found. Using system environment variables.');
  console.warn('   Consider creating a .env file for easier configuration.');
}

// Display current environment info
console.log('\n📊 Environment Information:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`   PORT: ${process.env.PORT || 'not set'}`);
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? 'set' : 'not set'}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? 'set' : 'not set'}`);

if (hasErrors) {
  console.error('\n❌ Environment validation failed!');
  process.exit(1);
} else {
  console.log('\n✅ Environment validation passed!');
  process.exit(0);
}

>>>>>>> 3e43144725eb806210cd8ae0a88274b3bf0b129b
