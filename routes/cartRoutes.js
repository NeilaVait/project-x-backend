const express = require('express');
const Cart = require('../models/cart');
const ShopItem = require('../models/item');
const router = express.Router();

// get count of carts of a user
router.get('/api/shop/cart/count/:userId', async (req, res) => {
  // gauti ta karta kurios userId yra lygus parametruose paduotam :userId
  const currentUserCartObj = await Cart.findOne({ userId: req.params.userId }).exec();
  console.log(' currentUserCartObj', currentUserCartObj);
  if (currentUserCartObj && currentUserCartObj.cart) {
    // grazinti co masyvo ilgi
    return res.json(currentUserCartObj.cart.length);
  }
  res.status(200).json(0);
});

// get user cart
router.get('/api/shop/cart/:userId', async (req, res) => {
  console.log('get user cart function ran');
  // res.json(`You want to get cart of a user ${}`);
  try {
    // we find all carts of all users
    const allCarts = await Cart.find();
    console.log(allCarts);
    // find current user cart
    const currentUserCart = allCarts.find((u) => u.userId == req.params.userId);

    res.json(currentUserCart.cart);
  } catch (err) {
    res.json(err);
  }
});

// add item to cart
router.post('/api/shop/cart/:userId', async (req, res) => {
  console.log('got item to add to cart');
  // console.log(req.body);

  try {
    // ar toks krepselis existuoja
    const currentCart = await Cart.findOne({ userId: req.params.userId }).exec();
    console.log(' currentCart', Boolean(currentCart));
    // jei jau yra toks cart tai mes norim prideti prie cart objektu
    if (!currentCart) {
      const newCart = new Cart({ userId: req.params.userId, cart: [req.body] });
      const result = await newCart.save();
      res.json({ msg: 'created a cart', result });
    } else {
      // count nelygu nuliui cartas siam vartotojui egzistuoja norim prideti i cart
      //currentCartArr esamas krepselis db
      // req.body = naujas item i krepseli
      const currentCartArr = currentCart.cart;
      const isItemInCartAlready = currentCartArr.find(
        (ci) => ci.itemId == req.body.itemId && ci.size === req.body.size
      );
      if (isItemInCartAlready) {
        // qty ++
        isItemInCartAlready.quantity++;
        console.log('qty++');
      } else {
        console.log('item push');
        currentCartArr.push(req.body);
      }
      await Cart.updateOne({ userId: req.params.userId }, { cart: currentCartArr });
      res.json({ msg: 'now in cart', currentCart });
    }

    // res.json('testing');
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
