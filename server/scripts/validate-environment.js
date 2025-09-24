#!/usr/bin/env node

/**
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

