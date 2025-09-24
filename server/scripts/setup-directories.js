#!/usr/bin/env node

/**
<<<<<<< HEAD
 * Setup Directories Script
=======
 * Setup directories script
>>>>>>> 3e43144725eb806210cd8ae0a88274b3bf0b129b
 * Creates necessary directories for the application
 */

const fs = require('fs');
const path = require('path');

<<<<<<< HEAD
const REQUIRED_DIRECTORIES = [
    'logs',
    'uploads',
    'uploads/images',
    'uploads/documents',
    'uploads/artifacts',
    'tmp'
];

function setupDirectories() {
    console.log('📁 Setting up required directories...');
    
    const serverRoot = path.join(__dirname, '..');
    
    REQUIRED_DIRECTORIES.forEach(dir => {
        const fullPath = path.join(serverRoot, dir);
        
        if (!fs.existsSync(fullPath)) {
            try {
                fs.mkdirSync(fullPath, { recursive: true });
                console.log(`✅ Created directory: ${dir}`);
            } catch (error) {
                console.error(`❌ Failed to create directory ${dir}:`, error.message);
            }
        } else {
            console.log(`✅ Directory already exists: ${dir}`);
        }
    });
    
    // Create .gitkeep files in empty directories
    REQUIRED_DIRECTORIES.forEach(dir => {
        const fullPath = path.join(serverRoot, dir);
        const gitkeepPath = path.join(fullPath, '.gitkeep');
        
        if (fs.existsSync(fullPath) && !fs.existsSync(gitkeepPath)) {
            try {
                fs.writeFileSync(gitkeepPath, '');
                console.log(`✅ Created .gitkeep in: ${dir}`);
            } catch (error) {
                console.error(`⚠️  Failed to create .gitkeep in ${dir}:`, error.message);
            }
        }
    });
    
    console.log('✅ Directory setup completed!');
}

// Run setup if called directly
if (require.main === module) {
    setupDirectories();
}

module.exports = setupDirectories;
=======
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

>>>>>>> 3e43144725eb806210cd8ae0a88274b3bf0b129b
