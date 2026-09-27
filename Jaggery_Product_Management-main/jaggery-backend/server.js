const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const orderRoutes = require("./routes/order.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // React dev server
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static product images — matches the frontend's
// `http://localhost:3001/images/${product.image}` URLs.
app.use("/images", express.static(path.join(__dirname, "uploads", "images")));

// Routes
// /auth/product, /auth/product/:id, /auth/adminlogin, /auth/category
app.use("/auth", productRoutes);
app.use("/auth", categoryRoutes);
app.use("/auth", authRoutes);

// /api/orders
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.json({ Status: true, Message: "Rila Groups API is running" });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ Status: false, Error: "Route not found" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Rila Groups API listening on http://localhost:${PORT}`);
});
