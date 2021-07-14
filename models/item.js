const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// reikia apibrezti kokio tipo duomenys bus saugomi DB

// { title: string, body: string, .. }

const shopItemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
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
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [Number],
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'category',
    },
  },
  { timestamps: true } /// adds timestamps
);

// exportuoti naujai sukurta objekta pagal sia schema
//                           turetu buti vienaskai musu kolecijos pav.
const ShopItem = mongoose.model('shopItem', shopItemSchema);

module.exports = ShopItem;
