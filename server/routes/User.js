const express = require('express');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Apply authentication to all routes
router.use(auth);

// GET /api/user/bookings - Get user's bookings
router.get('/bookings', async (req, res) => {
  try {
    const userId = req.user.id;
    // For now, return empty array - implement with actual booking logic
    res.json({
      success: true,
      data: [],
      message: 'User bookings retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving bookings',
      error: error.message
    });
  }
});

// PUT /api/user/profile - Update user profile
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    
    // For now, return success - implement with actual user update logic
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { id: userId, ...updateData }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// GET /api/user/heritage-sites - Get heritage sites
router.get('/heritage-sites', async (req, res) => {
  try {
    // For now, return empty array - implement with actual heritage sites logic
    res.json({
      success: true,
      data: [],
      message: 'Heritage sites retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving heritage sites',
      error: error.message
    });
  }
});

// GET /api/user/dashboard - Get user dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user.id;
    const user = req.user;
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        stats: {
          totalBookings: 0,
          activeBookings: 0,
          completedTours: 0
        },
        recentActivity: []
      },
      message: 'User dashboard data retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving dashboard data',
      error: error.message
    });
  }
});

module.exports = router;
