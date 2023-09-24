const express = require("express");
const {
  addToCart,
  fetchCartProducts,
  clearCart,
  updateCart,
} = require("../controllers/CartController");

const router = express.Router();

router.post("/addtocart", addToCart);
router.get("/:userId", fetchCartProducts);
router.post("/update", updateCart);
router.post("/clear/:userId", clearCart);

module.exports = router;
