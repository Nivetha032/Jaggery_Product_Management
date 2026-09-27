const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyAdmin = require("../middleware/verifyAdmin");

// POST /api/orders — create a new order
// Used by Checkout.js. It sends:
// { product_name, name, number, flat, street, city, email, state,
//   country, pin_code, total_price, products: [{id, name, price, quantity}] }
router.post("/", async (req, res) => {
  const {
    product_name,
    name,
    number,
    flat,
    street,
    city,
    email,
    state,
    country,
    pin_code,
    total_price,
    products,
  } = req.body;

  if (!name || !email || !products || products.length === 0) {
    return res.status(400).json({ Status: false, Error: "Missing required order fields" });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      `INSERT INTO orders
        (product_name, name, number, flat, street, city, email, state, country, pin_code, total_price)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [product_name, name, number, flat, street, city, email, state, country, pin_code, total_price]
    );

    const orderId = orderResult.insertId;

    for (const item of products) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.id, item.name, item.price, item.quantity]
      );
    }

    await connection.commit();
    res.json({ Status: true, Result: { orderId } });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ Status: false, Error: "Failed to place order" });
  } finally {
    connection.release();
  }
});

// GET /api/orders — admin: list all orders with their line items
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const [orders] = await db.query("SELECT * FROM orders ORDER BY created_at DESC");
    const [items] = await db.query("SELECT * FROM order_items");

    const result = orders.map((order) => ({
      ...order,
      items: items.filter((item) => item.order_id === order.id),
    }));

    res.json({ Status: true, Result: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: false, Error: "Failed to fetch orders" });
  }
});

module.exports = router;
