const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({ message: "Auth Error: No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRECT_KEY);
    req.user = decoded.userId;
    next();
  } catch (e) {
    res.status(500).send({ message: "Session Expaires Please Login Again" });
    console.error(e);
  }
};
