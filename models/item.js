const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    pricethor: {
      type: String,
      required: true,
    },
    salePrice: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Item = mongoose.model('item', itemSchema);

module.exports = Item;
