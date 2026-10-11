const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyAdmin = require("../middleware/verifyAdmin");

const LOW_STOCK = 10;

// GET /auth/stats — everything the dashboard overview needs, in one request
router.get("/stats", verifyAdmin, async (req, res) => {
  try {
    const [[totals]] = await db.query(
      `SELECT
         (SELECT COUNT(*) FROM product) AS products,
         (SELECT COUNT(*) FROM category) AS categories,
         (SELECT COUNT(*) FROM product WHERE stock = 0) AS out_of_stock,
         (SELECT COUNT(*) FROM product WHERE stock > 0 AND stock <= ?) AS low_stock,
         (SELECT COUNT(*) FROM orders) AS orders,
         (SELECT COUNT(*) FROM orders WHERE status = 'pending') AS pending_orders,
         (SELECT COALESCE(SUM(total_price), 0) FROM orders WHERE status <> 'cancelled') AS revenue,
         (SELECT COALESCE(SUM(price * stock), 0) FROM product) AS inventory_value`,
      [LOW_STOCK]
    );

    const [byCategory] = await db.query(
      `SELECT COALESCE(c.name, 'Uncategorised') AS name, COUNT(p.id) AS count
       FROM product p LEFT JOIN category c ON c.id = p.category_id
       GROUP BY c.name ORDER BY count DESC`
    );

    const [byStatus] = await db.query(
      "SELECT status, COUNT(*) AS count FROM orders GROUP BY status"
    );

    const [recentOrders] = await db.query(
      "SELECT id, name, total_price, status, created_at FROM orders ORDER BY created_at DESC, id DESC LIMIT 5"
    );

    const [lowStockItems] = await db.query(
      `SELECT id, name, stock, image FROM product
       WHERE stock <= ? ORDER BY stock ASC, name LIMIT 6`,
      [LOW_STOCK]
    );

    res.json({
      Status: true,
      Result: { totals, byCategory, byStatus, recentOrders, lowStockItems, lowStockThreshold: LOW_STOCK },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: false, Error: "Failed to load dashboard stats" });
  }
});

module.exports = router;
