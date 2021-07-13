const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reqString = {
  type: String,
  required: true,
};
const reqNumber = {
  type: Number,
  required: true,
};

const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    cart: [
      {
        title: reqString,
        image: reqString,
        price: reqNumber,
        color: reqString,
        size: reqString,
        sku: reqString,
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'shopItem',
          required: true,
        },
        quantity: reqNumber,
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;
