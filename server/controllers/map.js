const HeritageSite = require('../models/HeritageSite');
const heritageData = require('../data/heritage-sites');

// Get all heritage sites for map
exports.getAllSites = async (req, res) => {
  try {
    const { category, region } = req.query;
    let sites;
    
    // Try MongoDB first, fallback to static data
    try {
      if (HeritageSite) {
        const filter = { isActive: true };
        
        if (category && category !== 'all') filter.category = category;
        if (region && region !== 'all') filter['location.region'] = region;
        
        const mongoSites = await HeritageSite.find(filter)
          .select('name description location category significance images')
          .sort('name');
        
        if (mongoSites.length > 0) {
          sites = mongoSites.map(site => ({
            id: site._id,
            name: site.name,
            description: site.description,
            lat: site.location.coordinates.latitude,
            lng: site.location.coordinates.longitude,
            category: site.category,
            region: site.location.region
          }));
        }
      }
    } catch (mongoError) {
      console.log('MongoDB not available, using static data');
    }
    
    // Fallback to static data if MongoDB fails or no data
    if (!sites || sites.length === 0) {
      sites = heritageData.map((site, index) => ({
        id: index + 1,
        name: site.name,
        description: site.description,
        lat: site.location.coordinates.latitude,
        lng: site.location.coordinates.longitude,
        category: site.category,
        region: site.location.region
      }));
      
      // Apply filters to static data
      if (category && category !== 'all') {
        sites = sites.filter(site => site.category === category);
      }
      if (region && region !== 'all') {
        sites = sites.filter(site => site.region === region);
      }
    }
    
    res.json({ success: true, data: sites, count: sites.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get site details by ID
exports.getSiteById = async (req, res) => {
  try {
    const site = await HeritageSite.findById(req.params.id);
    if (!site) return res.status(404).json({ success: false, message: 'Site not found' });
    
    res.json({ success: true, data: site });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get filter options
exports.getFilters = async (req, res) => {
  try {
    const categories = await HeritageSite.distinct('category', { isActive: true });
    const regions = await HeritageSite.distinct('location.region', { isActive: true });
    
    res.json({
      success: true,
      data: { categories: categories.sort(), regions: regions.sort() }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
