const express = require('express');
const router = express.Router();
const mapController = require('../controllers/map');

// GET /api/map/sites - Get all heritage sites
router.get('/sites', mapController.getAllSites);

// GET /api/map/sites/:id - Get site details
router.get('/sites/:id', mapController.getSiteById);

// GET /api/map/filters - Get filter options
router.get('/filters', mapController.getFilters);

module.exports = router;
