const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const ProductRouts = require("./Routes/ProductRouts");
const AuthRoute = require("./Routes/AuthRoute");
const cartRoute = require("./Routes/CartRoutes");
const adminRoute = require("./Routes/AdminRouts");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("./public"));
app.use(cors());

app.get("/", (req, res) => {
  res.json({ success: "Server Started" });
});

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_PORT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`DB connected`);
  })
  .catch((err) => console.log("connection error: " + err));

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.use("/auth", AuthRoute);
app.use("/products", ProductRouts);
app.use("/cart", cartRoute);
app.use("/admin", adminRoute);
