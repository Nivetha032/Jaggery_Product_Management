const express = require("express");
const path = require("path");
const router = express.Router();
const db = require("../config/db");
const upload = require("../middleware/upload");
const verifyAdmin = require("../middleware/verifyAdmin");

// Never SELECT * here: image_data is a large binary column and must not be sent as JSON.
const PRODUCT_COLUMNS = `
  p.id, p.name, p.category_id, c.name AS category_name, p.price, p.stock,
  p.expiry_date, p.description, p.image, p.created_at,
  (p.image_data IS NOT NULL) AS image_in_db`;

const BASE_QUERY = `SELECT ${PRODUCT_COLUMNS} FROM product p LEFT JOIN category c ON c.id = p.category_id`;

// Runs multer and turns its errors (file too large, wrong type) into clean JSON.
const handleUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (!err) return next();
    const message =
      err.code === "LIMIT_FILE_SIZE" ? "Image is too large (max 2 MB)." : err.message;
    res.status(400).json({ Status: false, Error: message });
  });
};

const makeImageName = (file) => {
  const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
  return `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
};

const validate = (body) => {
  if (!body.name || !body.name.trim()) return "Product name is required.";
  const price = Number(body.price);
  if (body.price === undefined || body.price === "" || Number.isNaN(price) || price < 0)
    return "A valid price is required.";
  const stock = Number(body.stock === undefined || body.stock === "" ? 0 : body.stock);
  if (!Number.isInteger(stock) || stock < 0) return "Stock must be a whole number (0 or more).";
  return null;
};

// GET /auth/product — public list (storefront + admin)
router.get("/product", async (req, res) => {
  try {
    const [rows] = await db.query(`${BASE_QUERY} ORDER BY p.created_at DESC, p.id DESC`);
    res.json({ Status: true, Result: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: false, Error: "Failed to fetch products" });
  }
});

// GET /auth/product/:id — public detail
router.get("/product/:id", async (req, res) => {
  try {
    const [rows] = await db.query(`${BASE_QUERY} WHERE p.id = ?`, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ Status: false, Error: "Product not found" });
    }
    res.json({ Status: true, Result: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: false, Error: "Failed to fetch product" });
  }
});

// POST /auth/product — admin: create (multipart/form-data, file field: "image")
router.post("/product", verifyAdmin, handleUpload, async (req, res) => {
  const problem = validate(req.body);
  if (problem) return res.status(400).json({ Status: false, Error: problem });

  try {
    const { name, category_id, price, stock, expiry_date, description } = req.body;
    const image = req.file ? makeImageName(req.file) : null;

    const [result] = await db.query(
      `INSERT INTO product
        (name, category_id, price, stock, expiry_date, description, image, image_data, image_mime)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        category_id || null,
        price,
        stock || 0,
        expiry_date || null,
        description || "",
        image,
        req.file ? req.file.buffer : null,
        req.file ? req.file.mimetype : null,
      ]
    );

    res.json({ Status: true, Result: { id: result.insertId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: false, Error: "Failed to create product" });
  }
});

// PUT /auth/product/:id — admin: update (image optional; kept if no new file is sent)
router.put("/product/:id", verifyAdmin, handleUpload, async (req, res) => {
  const problem = validate(req.body);
  if (problem) return res.status(400).json({ Status: false, Error: problem });

  try {
    const { name, category_id, price, stock, expiry_date, description } = req.body;

    let sql = `UPDATE product SET name=?, category_id=?, price=?, stock=?, expiry_date=?, description=?`;
    const params = [
      name.trim(),
      category_id || null,
      price,
      stock || 0,
      expiry_date || null,
      description || "",
    ];

    if (req.file) {
      sql += `, image=?, image_data=?, image_mime=?`;
      params.push(makeImageName(req.file), req.file.buffer, req.file.mimetype);
    }
    sql += ` WHERE id=?`;
    params.push(req.params.id);

    const [result] = await db.query(sql, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ Status: false, Error: "Product not found" });
    }
    res.json({ Status: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: false, Error: "Failed to update product" });
  }
});

// DELETE /auth/product/:id — admin
router.delete("/product/:id", verifyAdmin, async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM product WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ Status: false, Error: "Product not found" });
    }
    res.json({ Status: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: false, Error: "Failed to delete product" });
  }
});

module.exports = router;
