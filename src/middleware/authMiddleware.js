const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authToken = req.header("Authorization");
  const token = authToken.replace("Bearer ", "");
  console.log("token", token);
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
