const express = require('express');
const Item = require('../models/item');
const router = express.Router();

router.get('/api/shop/items', (req, res) => {
  Item.find()
    .then((items) => res.json(items))
    .catch((err) => res.status(500).json(err));
});

router.post('/api/shop/items/new', (req, res) => {
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
