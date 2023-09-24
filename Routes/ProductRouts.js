const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  addProduct,
  getAllProducts,
  getSingleProduct,
  getFilteredProducts,

  searchProducts,
  sortProducts,
} = require("../controllers/ProductController");
const router = express.Router();

router.post("/addproduct", addProduct);
router.get("/:id", getSingleProduct);
router.get("/", getAllProducts);
router.get("/api/search", searchProducts);
router.get("/api/filter", getFilteredProducts);
router.get("/api/sort", sortProducts);

module.exports = router;
