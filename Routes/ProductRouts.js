const express = require("express");

const {
  getAllProducts,
  getSingleProduct,
  getFilteredProducts,
} = require("../controllers/ProductController");
const router = express.Router();

router.get("/:id", getSingleProduct);
router.get("/", getAllProducts);
router.get("/api/filter", getFilteredProducts);

module.exports = router;
