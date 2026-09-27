-- =========================================================
-- Rila Groups / Jaggery Product Management — Database Schema
-- =========================================================

CREATE DATABASE IF NOT EXISTS rila;
USE rila;

-- ---------------------------------------------------------
-- Admin (for the product/category management dashboard)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL, -- bcrypt hash
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default admin login: admin@rila.com / admin123
-- (bcrypt hash, 10 rounds — regenerate with:
--  node -e "console.log(require('bcryptjs').hashSync('yourpassword', 10))")
INSERT INTO admin (email, password)
VALUES ('admin@rila.com', '$2a$10$.qmp82NK/FL1/XF5iGQSX.aqvGbS0Te0iMhbaESXNH3SMMEIMXihC')
ON DUPLICATE KEY UPDATE email = email;

-- ---------------------------------------------------------
-- Category
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

INSERT INTO category (id, name) VALUES
  (1, 'Jaggery'),
  (2, 'Coconut Products'),
  (3, 'Sweets')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ---------------------------------------------------------
-- Product
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category_id INT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  expiry_date DATE,
  description TEXT,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL
);

-- Seed products. Matching image files are shipped in /uploads/images
-- and copied from the frontend's existing assets.
INSERT INTO product (id, name, category_id, price, stock, expiry_date, description, image) VALUES
  (1, 'Organic Coconut Block', 2, 180.00, 25, '2026-12-31',
   'Cold-pressed, chemical-free coconut jaggery blocks made using traditional methods. Rich, earthy flavor with no added preservatives.',
   'coconut.jpg'),
  (2, 'Pure Jaggery Powder', 1, 120.00, 40, '2027-03-31',
   'Finely ground jaggery powder, perfect for tea, desserts and everyday cooking. 100% natural with no refined sugar.',
   'jaggery_powder.jpg'),
  (3, 'Traditional Jaggery Sweets', 3, 250.00, 15, '2026-11-30',
   'Handmade sweets crafted from pure jaggery and natural ingredients, following recipes passed down through generations.',
   'sweets.webp')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ---------------------------------------------------------
-- Orders (header) + order_items (line items)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_name TEXT,
  name VARCHAR(150),
  number VARCHAR(30),
  flat VARCHAR(100),
  street VARCHAR(150),
  city VARCHAR(100),
  email VARCHAR(150),
  state VARCHAR(100),
  country VARCHAR(100),
  pin_code VARCHAR(20),
  total_price DECIMAL(10, 2),
  status VARCHAR(30) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT,
  product_name VARCHAR(150),
  price DECIMAL(10, 2),
  quantity INT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- Employee (kept minimal — matches README's feature list)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  role VARCHAR(100),
  phone VARCHAR(30),
  email VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
