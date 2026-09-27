const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyAdmin = require("../middleware/verifyAdmin");

// GET /auth/category — public, useful for building product filters
router.get("/category", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM category ORDER BY name");
    res.json({ Status: true, Result: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: false, Error: "Failed to fetch categories" });
  }
});

// POST /auth/category — admin only
router.post("/category", verifyAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    const [result] = await db.query("INSERT INTO category (name) VALUES (?)", [name]);
    res.json({ Status: true, Result: { id: result.insertId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: false, Error: "Failed to create category" });
  }
});

// DELETE /auth/category/:id — admin only
router.delete("/category/:id", verifyAdmin, async (req, res) => {
  try {
    await db.query("DELETE FROM category WHERE id = ?", [req.params.id]);
    res.json({ Status: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: false, Error: "Failed to delete category" });
  }
});

module.exports = router;
