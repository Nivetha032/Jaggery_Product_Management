const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const db = require("./config/db");
const migrate = require("./config/migrate");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const orderRoutes = require("./routes/order.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(cors({ origin: ["http://localhost:3000", "http://127.0.0.1:3000"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Product images. Uploaded images live in the database (product.image_data);
// the original seed images ship on disk. Same URL shape for both:
//   http://localhost:3001/images/<filename>
app.get("/images/:filename", async (req, res, next) => {
  try {
    const [rows] = await db.query(
      "SELECT image_data, image_mime FROM product WHERE image = ? AND image_data IS NOT NULL LIMIT 1",
      [req.params.filename]
    );
    if (rows.length > 0) {
      res.set("Content-Type", rows[0].image_mime || "application/octet-stream");
      res.set("Cache-Control", "public, max-age=86400");
      return res.send(rows[0].image_data);
    }
  } catch (err) {
    console.error("Image lookup failed:", err.message);
  }
  next(); // fall through to files on disk
});
app.use("/images", express.static(path.join(__dirname, "uploads", "images")));

// /auth/product, /auth/category, /auth/adminlogin, /auth/stats
app.use("/auth", productRoutes);
app.use("/auth", categoryRoutes);
app.use("/auth", authRoutes);
app.use("/auth", adminRoutes);

app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.json({ Status: true, Message: "Rila Groups API is running" });
});

app.use((req, res) => {
  res.status(404).json({ Status: false, Error: "Route not found" });
});

// Last-resort error handler so the API always answers in JSON
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ Status: false, Error: "Something went wrong" });
});

const PORT = process.env.PORT || 3001;
migrate().finally(() => {
  app.listen(PORT, () => {
    console.log(`Rila Groups API listening on http://localhost:${PORT}`);
  });
});
