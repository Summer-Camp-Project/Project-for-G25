const express = require('express');
const router = express.Router();

// Basic education routes to prevent server startup errors
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Education API endpoint',
    data: []
  });
});

router.get('/courses', (req, res) => {
  res.json({
    success: true,
    message: 'Education courses',
    data: []
  });
});

module.exports = router;
