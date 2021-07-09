const express = require('express');
const Category = require('../models/category');
const router = express.Router();

// gauti visas kategorijas

router.get('/api/shop/categories', (req, res) => {
  Category.find()
    .then((categories) => res.json(categories))
    .catch((err) => res.status(500).json(err));
});

// sukurti nauja kategorija

router.post('/api/shop/categories/new', (req, res) => {
  // gauti is userio title
  console.log(req.body);
  const titleFromUser = req.body.title;
  if (!titleFromUser) return res.status(400).json('no title');
  // su gautu title sukurti nauja categorijja
  const newCat = new ShopCategory({ title: titleFromUser });

  newCat
    .save()
    .then((result) => res.json(['category created', result]))
    .catch((err) => res.status(500).json('internal error'));
});

module.exports = router;
