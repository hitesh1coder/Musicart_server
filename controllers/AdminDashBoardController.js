const User = require("../Models/UserModel.js");
const { productModal } = require("../Models/ProductModal");
const cloudinary = require("../utility/cloudinaryConfig.js");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const dotenv = require("dotenv");
dotenv.config();

const uploadMiddleWare = require("../middleware/multerMiddleware");

const addProduct = async (req, res) => {
  const {
    title,
    brand,
    description,
    price,
    stock,
    type,
    color,
    detail1,
    detail2,
    detail3,
  } = req.body;
  // console.log(req.body);

  if (
    !title ||
    !brand ||
    !description ||
    !price ||
    !stock ||
    !type ||
    !color ||
    !detail1 ||
    !detail2 ||
    !detail3
  ) {
    return res.status(502).json({ message: "all fields are required" });
  }
  try {
    upload.array("images", 4);
    try {
      const uploadedImage = [];
      const imagetoUpload = req.body.images;
      for (const image of imagetoUpload) {
        const result = await cloudinary.uploader.upload(image, {
          folder: "products",
        });
        uploadedImage.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      req.body.images = uploadedImage;
      console.log(first);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {}

  // try {
  //   const product = await productModal.create(req.body);
  //   res.status(200).json(product);
  // } catch (error) {
  //   res.status(500).json(error);
  // }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  addProduct,
};
