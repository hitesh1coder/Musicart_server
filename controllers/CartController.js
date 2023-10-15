const User = require("../Models/UserModel.js");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIP_SECRECT_KEY);

const addToCart = async (req, res) => {
  try {
    const { userId, product, quantity = 1 } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cartItem = user.cart.find(
      (item) => item._id.toString() === product._id
    );

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cart.push(product);
    }

    await user.save();
    res.status(200).send(user.cart);
  } catch (error) {
    res.status(500).send({ message: "Failed to add to cart", error });
  }
};
const fetchCartProducts = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
const updateCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const cartItem = user.cart.find(
      (item) => item._id.toString() === productId
    );
    if (!cartItem) {
      return res.status(400).send({ message: "Product not in cart" });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.status(200).send(user.cart);
  } catch (error) {
    res.status(500).send({ message: "Failed to update cart", error });
  }
};
const removerFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.cart = user.cart.filter((item) => item._id.toString() !== productId);
    await user.save();

    res
      .status(200)
      .json({ message: "Product removed from cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove product from cart" });
  }
};

const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.cart = [];

    await user.save();

    res.status(200).send({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).send({ message: "Failed to clear cart", error });
  }
};

const checkoutCart = async (req, res) => {
  try {
    const { cartItems, totalAmount, cartTotalAmount } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cartItems?.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.title,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.CLIENT_PORT}/order-success`,
      cancel_url: `${process.env.CLIENT_PORT}/checkout`,
    });
    res.json({ id: session.id });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  addToCart,
  fetchCartProducts,
  updateCart,
  removerFromCart,
  clearCart,
  checkoutCart,
};
