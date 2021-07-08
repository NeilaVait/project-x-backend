const express = require('express');
const ShopItem = require('../models/item');
const router = express.Router();

router.get('/api/shop/items', (req, res) => {
  ShopItem.find()
    .then((items) => res.json(items))
    .catch((err) => res.status(500).json(err));
});

router.post('/api/shop/items/new', (req, res) => {
  console.log(req.body);

  const newItemData = {
    title: 'Suede Combat Boots - Grey',
    price: 1299.95,
    image: 'shoe_01_',
    color: 'grey',
    sizeQty: [
      { size: 'small', quantity: 5 },
      { size: 'medium', quantity: 5 },
      { size: 'large', quantity: 6 },
    ],
    images: [1, 2, 3, 4],
    sku: 'shoe_01',
    category: '60e59315bfe6f411e4186e47',
  };
  const newItem = new ShopItem(newItemData);

  newItem
    .save()
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

module.exports = router;
