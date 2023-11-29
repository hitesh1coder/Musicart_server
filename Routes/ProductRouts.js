const express = require("express");

const {
  addProduct,
  getAllProducts,
  getSingleProduct,
  getFilteredProducts,
} = require("../controllers/ProductController");
const router = express.Router();

router.post("/addproduct", addProduct);
router.get("/:id", getSingleProduct);
router.get("/", getAllProducts);
router.get("/api/filter", getFilteredProducts);

module.exports = router;
