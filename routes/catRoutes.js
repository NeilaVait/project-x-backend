const express = require('express');
const router = express.Router;

router.get('/api/shop/categories', (req, res) => {
  res.json('you are about to get categories');
});

module.exports = router;
