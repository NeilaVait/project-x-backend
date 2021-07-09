const express = require('express');
const Cart = require('../models/cart');
const router = express.Router();

// get user cart
router.get('/api/shop/cart/:userId', (req, res) => {
  res.json(`you want to get cart of user ${req.params.userId}`);
});

// add item to cart
router.post('/api/shop/cart/:userId', async (req, res) => {
  console.log('got item to add to cart');
  console.log(req.body);

  try {
    // jei jau yra toks cart tai mes norim prideti prie carto objektu
    const cartExists = Cart.findOne({ userId: req.params.userId });
    console.log(cartExists.mongooseCollection.name);

    // jei nera sukurti nauja
    const newCart = new Cart({ userId: req.params.userId, cart: [req.body] });
    const result = await newCart.save();
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
