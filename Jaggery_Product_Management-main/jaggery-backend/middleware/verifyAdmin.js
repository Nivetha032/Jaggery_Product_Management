const jwt = require("jsonwebtoken");
require("dotenv").config();

// Protects admin-only routes (create/update/delete product & category).
// Frontend sends: Authorization: Bearer <token>
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ Status: false, Error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "dev_secret", (err, decoded) => {
    if (err) {
      return res.status(403).json({ Status: false, Error: "Invalid or expired token" });
    }
    req.admin = decoded;
    next();
  });
};

module.exports = verifyAdmin;
