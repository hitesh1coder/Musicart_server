const { productModal } = require("../Models/ProductModal");

const addProduct = async (req, res) => {
  const {
    title,
    brand,
    description,
    price,
    images,
    stock,
    type,
    color,
    details,
  } = req.body;

  if (
    !title ||
    !brand ||
    !description ||
    !price ||
    !stock ||
    !type ||
    !color ||
    !details
  ) {
    return res.status(502).json({ message: "all fields are required" });
  }

  try {
    const product = await productModal.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productModal.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getFilteredProducts = async (req, res) => {
  const { type, brand, color, priceRange } = req.query;

  const filter = {};

  if (type) {
    filter.type = type;
  }

  if (brand) {
    filter.brand = brand;
  }

  if (color) {
    filter.color = color;
  }

  if (priceRange) {
    const priceRanges = {
      "0-1000": { $gte: 0, $lte: 1000 },
      "1000-10000": { $gte: 1000, $lte: 10000 },
      "10000-20000": { $gte: 10000, $lte: 20000 },
      "20000-100000": { $gte: 20000, $lte: 100000 },
    };

    filter.price = priceRanges[priceRange];
  }

  try {
    const products = await productModal.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

const sortProducts = async (req, res) => {
  const { sortBy, order } = req.query;
  const sortQuery = sortBy ? { [sortBy]: order === "desc" ? -1 : 1 } : {};

  try {
    const products = await productModal.find().sort(sortQuery);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

const searchProducts = async (req, res) => {
  const { search } = req.query;
  const query = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { color: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const products = await productModal.find(query);
  res.status(200).json(products);
};

const getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const singleProduct = await productModal.findById(productId);
    res.status(200).json(singleProduct);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  searchProducts,
  sortProducts,
  addProduct,
  getAllProducts,
  getSingleProduct,
  getFilteredProducts,
};
