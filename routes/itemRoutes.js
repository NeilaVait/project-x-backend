const express = require('express');
const ShopItem = require('../models/item');
const newItemData = require('../models/stock');
const router = express.Router();

// add new item
router.post('/api/shop/items/new', (req, res) => {
  console.log(req.body);

  // const newItemData = {
  //   title: 'Suede Combat Boots - Stone',
  //   price: 1299.95,
  //   image: 'shoe_02_',
  //   color: 'stone',
  //   size: 'small',
  //   quantity: 15,
  //   images: [1, 2, 3, 4],
  //   sku: 'shoe_01',
  //   category: '60e59315bfe6f411e4186e47',
  // };
  const newItem = new ShopItem(newItemData[0]);

  newItem
    .save()
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

//get all items
router.get('/api/shop/items', async (req, res) => {
  try {
    const items = await ShopItem.find().populate('category');
    res.json(items);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get single item
router.get('/api/shop/items/:id', async (req, res) => {
  try {
    const item = await ShopItem.findById(req.params.id);
    res.json(item);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get items by category

router.get('/api/shop/items/category/:catId', async (req, res) => {
  try {
    const catId = req.params.catId;
    const items = await ShopItem.find({ category: catId });
    res.json(items);
  } catch (err) {
    // kol kuriam aplikacija
    res.json(err);
    // productione naudojam
    res.sendStatus(500);
  }
});

module.exports = router;
