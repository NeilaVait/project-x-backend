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
    // ar toks krepselis egzistuoja
    const currentCart = await Cart.findOne({ userId: req.params.userId }).exec();
    console.log('currentCart', Boolean(currentCart));

    // jei nera tokio cart kuriam nauja
    if (!currentCart) {
      const newCart = new Cart({ userId: req.params.userId, cart: [req.body] });
      const result = await newCart.save();
      res.json({ msg: 'created cart', result });
    } else {
      // currentCart nelygu nuliui/ cartas jau egzistuoja
      const currentCartArr = currentCart.cart;
      currentCartArr.push(req.body);
      await Cart.updateOne({ userId: req.params.userId }, { cart: currentCartArr });

      res.json({ msg: 'now in cart', currentCart });
    }

    // res.json('testing')
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
