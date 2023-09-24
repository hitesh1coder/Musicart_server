const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  brand: String,
  description: String,
  price: Number,
  images: [String],
  stock: Number,
  type: String,
  color: String,
  details: [String],
});
const productModal = mongoose.model("Product", productSchema);

module.exports = { productModal };
