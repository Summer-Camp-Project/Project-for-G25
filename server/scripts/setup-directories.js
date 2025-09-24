#!/usr/bin/env node

/**
 * Setup directories script
 * Creates necessary directories for the application
 */

const fs = require('fs');
const path = require('path');

console.log('📁 Setting up application directories...\n');

const directories = [
  'uploads',
  'uploads/artifacts',
  'uploads/courses',
  'uploads/events',
  'uploads/events/images',
  'uploads/lessons',
  'uploads/museums',
  'uploads/staff',
  'logs',
  'temp'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    } catch (error) {
      console.error(`❌ Failed to create directory ${dir}:`, error.message);
    }
  } else {
    console.log(`📁 Directory already exists: ${dir}`);
  }
});

console.log('\n✅ Directory setup completed!');

