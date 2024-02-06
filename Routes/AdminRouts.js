const express = require("express");
const {
  getAllUsers,
  addProduct,
} = require("../controllers/AdminDashBoardController");
const router = express.Router();

router.get("/allusers", getAllUsers);
router.post("/add-product", addProduct);
s;

module.exports = router;
