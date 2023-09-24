const User = require("../Models/UserModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const registerUser = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(502).send({
        status: "failed",
        message: "This user already exists",
      });
    }

    if (!email || !password || !name || !mobile) {
      return res.status(503).send({
        status: "failed",
        message: "All fields required",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      mobile,
      email,
      password: encryptedPassword,
      cart: [],
    });
    const jwtToken = jwt.sign(
      { email, password: encryptedPassword },
      process.env.JWT_SECRECT_KEY,
      { expiresIn: 1800 }
    );

    return res.status(200).send({
      name: user.name,
      status: "success",
      userid: user._id,
      message: "User Registered successfully",
      token: jwtToken,
      cart: user.cart,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: "fail", message: "Something went wrong" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(502).send({
        status: "failed",
        message: "This username is not registered",
      });
      return;
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      res.status(501).send({
        status: "failed",
        message: "Credentials did not match",
      });
      return;
    }

    const jwtToken = jwt.sign({ email }, process.env.JWT_SECRECT_KEY, {
      expiresIn: 1800,
    });

    res.status(200).send({
      name: user.name,
      status: "success",
      userid: user._id,
      message: "User logged in successfully",
      token: jwtToken,
      cart: user.cart,
    });
  } catch (error) {
    res.status(503).send({
      status: "failed",
      message: "Incorrect credentials",
    });
  }
};

module.exports = { registerUser, loginUser };
