const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Map data' });
});

module.exports = router;

