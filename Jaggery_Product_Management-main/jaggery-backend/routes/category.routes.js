const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyAdmin = require("../middleware/verifyAdmin");

// GET /auth/category — public. Includes how many products each category holds.
router.get("/category", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.id, c.name, COUNT(p.id) AS product_count
       FROM category c LEFT JOIN product p ON p.category_id = c.id
       GROUP BY c.id, c.name ORDER BY c.name`
    );
    res.json({ Status: true, Result: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: false, Error: "Failed to fetch categories" });
  }
});

// POST /auth/category — admin
router.post("/category", verifyAdmin, async (req, res) => {
  const name = (req.body.name || "").trim();
  if (!name) return res.status(400).json({ Status: false, Error: "Category name is required." });
  try {
    const [result] = await db.query("INSERT INTO category (name) VALUES (?)", [name]);
    res.json({ Status: true, Result: { id: result.insertId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: false, Error: "Failed to create category" });
  }
});

// PUT /auth/category/:id — admin (rename)
router.put("/category/:id", verifyAdmin, async (req, res) => {
  const name = (req.body.name || "").trim();
  if (!name) return res.status(400).json({ Status: false, Error: "Category name is required." });
  try {
    await db.query("UPDATE category SET name = ? WHERE id = ?", [name, req.params.id]);
    res.json({ Status: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: false, Error: "Failed to update category" });
  }
});

// DELETE /auth/category/:id — admin (products keep existing, category becomes empty)
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
