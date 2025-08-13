const HeritageSite = require('../models/HeritageSite');

// Get all heritage sites for map
exports.getAllSites = async (req, res) => {
  try {
    const { category, region } = req.query;
    const filter = { isActive: true };
    
    if (category && category !== 'all') filter.category = category;
    if (region && region !== 'all') filter['location.region'] = region;
    
    const sites = await HeritageSite.find(filter)
      .select('name location category significance images')
      .sort('name');
    
    const mapData = sites.map(site => ({
      id: site._id,
      name: site.name,
      lat: site.location.coordinates.latitude,
      lng: site.location.coordinates.longitude,
      category: site.category,
      region: site.location.region
    }));
    
    res.json({ success: true, data: mapData });
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
