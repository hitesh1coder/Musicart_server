const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  title: String,
  brand: String,
  description: String,
  price: Number,
  images: [String],
  stock: Number,
  type: String,
  color: String,
  details: [String],
  quantity: {
    type: Number,
    default: 1,
  },
});

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: [cartItemSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
