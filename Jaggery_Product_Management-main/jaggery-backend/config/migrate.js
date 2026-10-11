const db = require("./db");

// Runs on every server start. Safe to run repeatedly: it only adds what's missing,
// so existing databases (e.g. imported from an older schema.sql) are upgraded automatically.
async function columnExists(table, column) {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS c FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  return rows[0].c > 0;
}

async function migrate() {
  try {
    if (!(await columnExists("product", "image_data"))) {
      await db.query("ALTER TABLE product ADD COLUMN image_data LONGBLOB NULL");
      console.log("[migrate] added product.image_data");
    }
    if (!(await columnExists("product", "image_mime"))) {
      await db.query("ALTER TABLE product ADD COLUMN image_mime VARCHAR(60) NULL");
      console.log("[migrate] added product.image_mime");
    }
    if (!(await columnExists("orders", "status"))) {
      await db.query("ALTER TABLE orders ADD COLUMN status VARCHAR(30) DEFAULT 'pending'");
      console.log("[migrate] added orders.status");
    }
  } catch (err) {
    console.warn("[migrate] skipped — could not reach database:", err.message);
  }
}

module.exports = migrate;
