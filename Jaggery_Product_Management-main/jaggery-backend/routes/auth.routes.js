const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

// POST /auth/adminlogin
// Body: { email, password }
router.post("/adminlogin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ Status: false, Error: "Email and password are required" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM admin WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ Status: false, Error: "Invalid email or password" });
    }

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ Status: false, Error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "8h" }
    );

    res.json({ Status: true, Result: { token, email: admin.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: false, Error: "Login failed" });
  }
});

module.exports = router;
