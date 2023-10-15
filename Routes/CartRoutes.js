const express = require("express");
const {
  addToCart,
  fetchCartProducts,
  clearCart,
  updateCart,
  removerFromCart,
  checkoutCart,
} = require("../controllers/CartController");

const router = express.Router();

router.post("/addtocart", addToCart);
router.get("/:userId", fetchCartProducts);
router.post("/update", updateCart);
router.delete("/:userId/:productId", removerFromCart);
router.post("/clear/:userId", clearCart);
router.post("/create-checkout-sesion", checkoutCart);

module.exports = router;
