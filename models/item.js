const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shopItemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  {
    price: {
      type: Number,
      required: true,
    },
  },
  {
    salePrice: {
      type: Number,
    },
  },
  {
    image: {
      type: String,
      required: true,
    },
  },
  {
    color: {
      type: String,
      required: true,
    },
  },
  {
    size: {
      type: String,
      required: true,
    },
  },
  {
    images: {
      type: [Number],
      required: true,
    },
  },
  {
    sku: {
      type: String,
      required: true,
    },
  },
  {
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'category',
    },
  },
  { timestamps: true }
);

const ShopItem = mongoose.model('ShopItem', shopItemSchema);

module.exports = ShopItem;
