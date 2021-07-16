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

// add item to cart
router.post('/api/shop/cart/:userId', async (req, res) => {
  // console.log('got item to add to cart');
  // console.log(req.body);
  // console.log('we made cartItem');
  // console.log(shopItemToCartItem(req.body));

  try {
    // ar toks krepselis existuoja
    const currentCart = await Cart.findOne({ userId: req.params.userId }).exec();

    // jei krepselis nesukurtas siam vartotojui
    if (!currentCart) {
      // console.log('newcart');
      const newCart = await createNewCart(req.params.userId, req.body);
      await updateShopItemStock(req.body._id, -1);
      res.json({ msg: 'created a cart', newCart: newCart });
    } else {
      // vartotojas jau turi krepseli
      // arba didinam kieki arba dedam nauja preke
      const currentCartArr = currentCart.cart;
      increaseQtyOrAddNewItem(isItemVariantInCartAlready(currentCartArr, req.body), currentCartArr, req.body);

      await Cart.updateOne({ userId: req.params.userId }, { cart: currentCartArr });
      // sumazinam item quantity
      await updateShopItemStock(req.body._id, -1);

      res.json({ msg: 'now in cart', currentCart });
    }
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
  const foundCartObj = await Cart.findOne({ userId: userId }).exec();

  // paieskoti tam carte item pagal cartId
  const foundCartItemToBeUpdated = foundCartObj.cart.find((cartItem) => cartItem._id == cartItemId);
  // higher level example
  // const foundCartItemToBeUpdated = cart.find(({ _id }) => _id == cartItemId);
  // atnaujinti kieki to item pagal newQty
  const difference = newQty - foundCartItemToBeUpdated.quantity;
  foundCartItemToBeUpdated.quantity = newQty;
  const saveResult = await foundCartObj.save();
  // updateShopItemStock(foundCartItemToBeUpdated.itemId, difference);
  res.json({ msg: 'atnaujinimas in progress', saveResult });
});

// helper fn

async function updateShopItemStock(shopItemId, newQty) {
  // console.log('updateShopItemStock');
  // gauti kiek yra item in stock
  console.log({ shopItemId, newQty });
  // naudojant shopitem modeli surasti ir atnaujinti shopitema kurio id === shopitemid
  const currentShopItem = await ShopItem.findById(shopItemId);
  currentShopItem.quantity = currentShopItem.quantity + difference;
  const updateResult = await currentShopItem.save();

  // console.log('updateResult ', updateResult, currentShopItem);
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
