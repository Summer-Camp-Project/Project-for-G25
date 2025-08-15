
const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Organizer dashboard data' });
});

module.exports = router;

