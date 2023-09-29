const express = require("express");
const {
  addToCart,
  fetchCartProducts,
  clearCart,
  updateCart,
  removerFromCart,
} = require("../controllers/CartController");

const router = express.Router();

router.post("/addtocart", addToCart);
router.get("/:userId", fetchCartProducts);
router.post("/update", updateCart);
router.delete("/:userId/:productId", removerFromCart);
router.post("/clear/:userId", clearCart);

module.exports = router;
