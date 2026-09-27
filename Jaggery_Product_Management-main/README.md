Jaggery Product Management System
A comprehensive web-based system for managing jaggery product operations — including inventory, employee details, orders, and category-wise management. Built using React.js, Node.js, Express, and MySQL, this platform streamlines jaggery production and sales workflows with efficiency and ease.

🚀 Features
🔐 Admin Authentication – Secure login system for administrators

📦 Product Management – Add, update, delete jaggery products with image support

🏷️ Category Management – Organize products by categories

🧑‍💼 Employee Management – Maintain records of staff involved in production or sales

📋 Order Management – Track, view, and manage orders placed by customers or retailers

🖼️ Image Uploads – Upload and store product images using multer

📊 Dashboard – Visual overview of product count, orders, and activities

🛠️ Tech Stack
Frontend:
React.js

Axios – For making API requests

React Router – For navigation between pages

Backend:
Node.js

Express.js

Multer – For handling file uploads (e.g. product images)

Database:
MySQL – Relational database to store all system data

Project Setup

This repo has two folders: `jaggery-backend` (Node/Express + MySQL API) and
`jaggery-frontend` (React app).

1. **Backend** — see `jaggery-backend/README.md` for full instructions.
   Quick version:
   ```bash
   cd jaggery-backend
   mysql -u root -p < sql/schema.sql
   cp .env.example .env   # edit with your MySQL credentials
   npm install
   npm run dev
   ```
   This starts the API on `http://localhost:3001` with 3 seeded sample
   products so the frontend has real data right away.

2. **Frontend**
   ```bash
   cd jaggery-frontend
   npm install
   npm start
   ```
   Runs on `http://localhost:3000` and talks to the backend above.

Run both at the same time (in two terminals) for the full app to work.
