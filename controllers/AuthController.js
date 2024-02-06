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
      isAdmin: false,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: "fail", message: "Something went wrong" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, usertype, secretKey } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(502).send({
        status: "failed",
        message: "This username is not registered",
      });
    }

    if (usertype === "User") {
      const matchPassword = await bcrypt.compare(password, user.password);

      if (!matchPassword) {
        return res.status(501).send({
          status: "failed",
          message: "Credentials did not match",
        });
      }

      const jwtToken = jwt.sign({ email }, process.env.JWT_SECRECT_KEY, {
        expiresIn: 1800,
      });

      return res.status(200).send({
        status: "success",
        message: "User logged in successfully",
        name: user.name,
        userid: user._id,
        token: jwtToken,
        cart: user.cart,
        isAdmin: false,
      });
    } else if (usertype === "Admin") {
      const matchPassword = await bcrypt.compare(password, user.password);

      if (!matchPassword) {
        return res.status(501).send({
          status: "failed",
          message: "Credentials did not match",
        });
      }

      if (!secretKey) {
        return res.status(501).send({
          status: "failed",
          message: "Admin secret key is required",
        });
      }

      if (secretKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(501).send({
          status: "failed",
          message: "Admin secret key did not match",
        });
      }

      const jwtToken = jwt.sign({ email }, process.env.JWT_SECRECT_KEY, {
        expiresIn: 1800,
      });

      return res.status(201).send({
        status: "success",
        message: "Admin Login Successful",
        name: user.name,
        userid: user._id,
        token: jwtToken,
        isAdmin: true,
      });
    }
  } catch (error) {
    res.status(503).send({
      error: error,
      status: "failed",
      message: "Incorrect credentials",
    });
  }
};

module.exports = { registerUser, loginUser };
