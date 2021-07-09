const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shopCartSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
  },
  { timestamps: true }
);

const ShopCart = mongoose.model('shopCart', shopCartSchema);

module.exports = ShopCart;
