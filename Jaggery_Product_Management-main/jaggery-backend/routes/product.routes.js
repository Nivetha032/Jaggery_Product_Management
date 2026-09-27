const express = require("express");
const router = express.Router();
const db = require("../config/db");
const upload = require("../middleware/upload");
const verifyAdmin = require("../middleware/verifyAdmin");

// GET /auth/product  — list all products
// Used by ProductList.js. Response shape must stay { Status, Result } / { Status, Error }
// because that's what the existing frontend code checks.
router.get("/product", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM product ORDER BY created_at DESC");
    res.json({ Status: true, Result: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: false, Error: "Failed to fetch products" });
  }
});

// GET /auth/product/:id — single product detail
// Used by ProductDetails.js.
router.get("/product/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM product WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ Status: false, Error: "Product not found" });
    }
    res.json({ Status: true, Result: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: false, Error: "Failed to fetch product" });
  }
});

// ----- Admin-only management (not called by the current UI, but wired up
// so you can build an admin dashboard against this API later) -----

// POST /auth/product — create product (multipart/form-data, field name: image)
router.post("/product", verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, category_id, price, stock, expiry_date, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const [result] = await db.query(
      `INSERT INTO product (name, category_id, price, stock, expiry_date, description, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, category_id || null, price, stock, expiry_date || null, description, image]
    );

    res.json({ Status: true, Result: { id: result.insertId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: false, Error: "Failed to create product" });
  }
});

// PUT /auth/product/:id — update product
router.put("/product/:id", verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, category_id, price, stock, expiry_date, description } = req.body;

    const fields = [name, category_id || null, price, stock, expiry_date || null, description];
    let sql = `UPDATE product SET name=?, category_id=?, price=?, stock=?, expiry_date=?, description=?`;

    if (req.file) {
      sql += `, image=?`;
      fields.push(req.file.filename);
    }
    sql += ` WHERE id=?`;
    fields.push(req.params.id);

    await db.query(sql, fields);
    res.json({ Status: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: false, Error: "Failed to update product" });
  }
});

// DELETE /auth/product/:id
router.delete("/product/:id", verifyAdmin, async (req, res) => {
  try {
    await db.query("DELETE FROM product WHERE id = ?", [req.params.id]);
    res.json({ Status: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: false, Error: "Failed to delete product" });
  }
});

module.exports = router;
