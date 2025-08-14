const mongoose = require('mongoose');
const dotenv = require('dotenv');
const HeritageSite = require('../models/HeritageSite');
const heritageData = require('../data/heritage-sites');

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📍 Connected to MongoDB Atlas');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing heritage sites...');
    await HeritageSite.deleteMany({});

    // Insert heritage sites data
    console.log('📝 Inserting Ethiopian heritage sites...');
    const insertedSites = await HeritageSite.insertMany(heritageData);
    
    console.log(`✅ Successfully inserted ${insertedSites.length} heritage sites:`);
    insertedSites.forEach(site => {
      console.log(`   - ${site.name} (${site.location.region})`);
    });

    // Verify the data
    const totalSites = await HeritageSite.countDocuments({ isActive: true });
    const unescoSites = await HeritageSite.countDocuments({ 
      category: 'UNESCO World Heritage', 
      isActive: true 
    });
    
    console.log('\n📊 Database Statistics:');
    console.log(`   Total Heritage Sites: ${totalSites}`);
    console.log(`   UNESCO World Heritage Sites: ${unescoSites}`);
    console.log(`   Categories: ${[...new Set(insertedSites.map(s => s.category))].join(', ')}`);
    console.log(`   Regions: ${[...new Set(insertedSites.map(s => s.location.region))].join(', ')}`);

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
