const express = require('express');
const Cart = require('../models/cart');
const ShopItem = require('../models/item');
const router = express.Router();

// get count of carts of a user
router.get('/api/shop/cart/count/:userId', async (req, res) => {
  // gauti ta karta kurios userId yra lygus parametruose paduotam :userId
  try {
    const currentUserCartObj = await Cart.findOne({ userId: req.params.userId }).exec();
    console.log('currentUserCartObj', currentUserCartObj);
    if (currentUserCartObj && currentUserCartObj.cart) {
      // grazinti co masyvo ilgi
      return res.json(currentUserCartObj.cart.length);
    }
    res.status(200).json(0);
  } catch (err) {
    res.json(err);
  }
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
  // console.log('got item to add to cart');
  // console.log(req.body);
  // console.log('we made cartItem');
  // console.log(shopItemToCartItem(req.body));

  // res.status(200).json();
  // return;

  try {
    // ar toks krepselis existuoja
    const currentCart = await Cart.findOne({ userId: req.params.userId }).exec();

    // jei krepselis nesukurtas siam vartotojui
    if (!currentCart) {
      console.log('newcart');
      const newCart = await createNewCart(req.params.userId, req.body);
      res.json({ msg: 'created a cart', newCart: newCart });
    } else {
      // vartotojas jau turi krepseli
      // arba didinam kieki arba dedam nauja preke
      const currentCartArr = currentCart.cart;
      increaseQtyOrAddNewItem(isItemVariantInCartAlready(currentCartArr, req.body), currentCartArr, req.body);
      await Cart.updateOne({ userId: req.params.userId }, { cart: currentCartArr });
      res.json({ msg: 'now in cart', currentCart });
    }
  } catch (err) {
    res.json(err);
  }
});

// helper fn
async function createNewCart(userId, body) {
  const newCart = new Cart({ userId: userId, cart: [shopItemToCartItem(body)] });
  await newCart.save();
  return newCart.cart;
}

function increaseQtyOrAddNewItem(didWeFindThisItem, currentCartArr, body) {
  if (didWeFindThisItem) {
    // qty ++
    didWeFindThisItem.quantity++;
  } else {
    currentCartArr.push(shopItemToCartItem(body));
  }
}

function isItemVariantInCartAlready(currentCartArr, body) {
  return currentCartArr.find((ci) => ci.itemId == body._id);
}

function shopItemToCartItem(shopItem) {
  const { title, image, price, salePrice, color, size, sku, _id: itemId } = shopItem;
  return {
    title,
    image,
    price,
    salePrice,
    color,
    size,
    sku,
    itemId,
  };
  /*
  shop item
  {
  images: [ 1, 2, 3, 4 ],
  _id: '60ee8253af44c537dcda3f4f',
  title: 'Green hat',
  price: 49.99,
  image: 'acc_hat_01_',
  color: 'green',
  size: 'normal',
  quantity: 3,
  sku: 'hat_01',
  category: '60e592febfe6f411e4186e45',
}

cart item 
cart: [
      {
        title: reqString,
        image: reqString,
        price: reqNumber,
        color: reqString,
        size: reqString,
        sku: reqString,
        quantity: 1,
      },
    ],
   */
}

module.exports = router;
