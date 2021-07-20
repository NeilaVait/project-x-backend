const express = require('express');
const Cart = require('../models/cart');
const ShopItem = require('../models/item');
const router = express.Router();

// get count of carts of a user
router.get('/api/shop/cart/count/:userId', async (req, res) => {
  // gauti ta karta kurios userId yra lygus parametruose paduotam :userId
  try {
    const currentUserCartObj = await Cart.findOne({ userId: req.params.userId }).exec();
    // console.log('currentUserCartObj', currentUserCartObj);
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
  // console.log('get user cart function ran');
  // res.json(`You want to get cart of a user ${}`);
  try {
    // we find all carts of all users
    const allCarts = await Cart.find();
    // console.log(allCarts);
    // find current user cart
    const currentUserCart = allCarts.find((u) => u.userId == req.params.userId);

    res.json(currentUserCart.cart);
  } catch (err) {
    res.json(err);
  }
});

// update cart qty
// gauti ats json pavidalu req.body
router.put('/api/shop/cart/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { cartItemId, newQty } = req.body;
  // susirasti carta pagal userId,
  console.log(' cartItemId, newQty', cartItemId, newQty);
  const foundCartObj = await Cart.findOne({ userId: userId }).exec();

  // paieskoti tam carte item pagal cartId
  const foundCartItemToBeUpdated = foundCartObj.cart.find((cartItem) => cartItem._id == cartItemId);
  // higher level example
  // const foundCartItemToBeUpdated = cart.find(({ _id }) => _id == cartItemId);
  // atnaujinti kieki to item pagal newQty
  const difference = foundCartItemToBeUpdated.quantity - newQty;
  console.log(' difference', difference);
  foundCartItemToBeUpdated.quantity = newQty;
  const saveResult = await foundCartObj.save();
  updateShopItemStock(foundCartItemToBeUpdated.itemId, difference);
  res.json({ msg: 'atnaujinimas in progress', saveResult });
});

// add item to cart
router.post('/api/shop/cart/:userId', async (req, res) => {
  try {
    // ar toks krepselis existuoja
    const currentCart = await Cart.findOne({ userId: req.params.userId }).exec();
    // console.log(' currentCart', currentCart);
    // jei krepselop siam vartotojui nera sukurta
    if (!currentCart) {
      // console.log('new cart');
      const newCart = await createNewCart(req.params.userId, req.body);
      await updateShopItemStock(req.body._id, -1);
      res.json({ msg: 'created a cart', newCart: newCart });
    } else {
      // vartotojas jau turi kreplseli
      // arba padidinti kieki vienetu jei ta pati preke arba prideti nauja i krepseli
      const currentCartArr = currentCart.cart;
      increaseQtyOrAddNewItem(isItemVariantInCartAlready(currentCartArr, req.body), currentCartArr, req.body);
      await Cart.updateOne({ userId: req.params.userId }, { cart: currentCartArr });
      // sumazinam item quantity kuris buvo nupirktas
      await updateShopItemStock(req.body._id, -1);
      res.json({ msg: 'add item to cart', currentCart });
    }
  } catch (err) {
    res.json(err);
  }
});

// remove item from cart
router.put('/api/shop/cart/delete/:userId', async (req, res) => {
  try {
    // res.json({ userId: req.params.userId, cartId: req.body.itemId });
    const userId = req.params.userId;
    const cartIndividualId = req.body.itemId;
    const foundCartObj = await Cart.findOne({ userId: userId }).exec();
    foundCartObj.cart = foundCartObj.cart.filter(({ itemId }) => itemId != cartIndividualId);
    // res.json(filteredCart);
    const finalCartObj = await foundCartObj.save();
    res.json(finalCartObj);
  } catch (error) {
    res.json(error);
  }
});

// helper fn
async function updateShopItemStock(shopItemId, difference) {
  // const updateResult = await ShopItem.findByIdAndUpdate(shopItemId, { quantity: difference }).exec();
  const currentShopItem = await ShopItem.findById(shopItemId);
  currentShopItem.quantity = currentShopItem.quantity + difference;
  await currentShopItem.save();
}

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
  /*
  shop item
  {
  images: [ 1, 2, 3 ],
  _id: '60ee82dc057db7c88f4ab4cb',
  title: 'Trench Biker Jeans',
  price: 111.99,
  image: 'denim_jeans_01_',
  color: 'blue',
  size: 'normal',
  quantity: 8,
  sku: 'jeans_01',
  category: 4545454
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
        itemId: 45645645
        quantity: 1
        },
      },
    ],
  */
  const { title, image, price, salePrice, color, size, sku, _id: itemId } = shopItem;
  return {
    title,
    image,
    price: salePrice || price,
    color,
    size,
    sku,
    itemId,
  };
}

module.exports = router;
