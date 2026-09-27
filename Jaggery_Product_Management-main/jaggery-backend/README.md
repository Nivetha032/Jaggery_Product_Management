# Rila Groups — Backend API

Express + MySQL API that powers the `jaggery-frontend` React app.

## What this provides

The frontend calls three endpoints — this backend implements exactly those,
plus a few extra admin routes for future use (product/category CRUD, order
listing, admin login):

| Method | Route                | Used by                          |
|--------|-----------------------|-----------------------------------|
| GET    | `/auth/product`       | `ProductList.js`                  |
| GET    | `/auth/product/:id`   | `ProductDetails.js`               |
| GET    | `/images/:filename`   | Product image `<img>` tags        |
| POST   | `/api/orders`         | `Checkout.js`                     |

Responses use the exact shape the frontend already expects:
`{ Status: true, Result: ... }` or `{ Status: false, Error: "..." }`.

## 1. Prerequisites

- Node.js 18+
- A running MySQL server (local install, Docker, or a hosted instance)

## 2. Set up the database

```bash
mysql -u root -p < sql/schema.sql
```

This creates the `rila` database with tables (`product`, `category`, `orders`,
`order_items`, `admin`, `employee`) and seeds 3 sample products so the
frontend has real data immediately. Their images are already included in
`uploads/images/`.

Seeded admin login (for the admin routes only — not required by the current
UI): `admin@rila.com` / `admin123`.

## 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and set your MySQL credentials:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=rila
PORT=3001
JWT_SECRET=change_this_to_a_long_random_string
```

## 4. Install & run

```bash
npm install
npm run dev     # nodemon, auto-restarts on change
# or
npm start        # plain node
```

You should see:

```
Rila Groups API listening on http://localhost:3001
```

## 5. Verify it works

```bash
curl http://localhost:3001/auth/product
```

You should get back the 3 seeded products. Then start the frontend
(`cd ../jaggery-frontend && npm start`) — `/products` should now load real
data instead of "Unable to reach the server".

## Notes

- CORS is currently locked to `http://localhost:3000` (the CRA dev server).
  Update the `origin` in `server.js` if you deploy the frontend elsewhere.
- Uploaded product images are stored on disk under `uploads/images/` and
  served statically at `/images/:filename`.
- The admin CRUD routes (`POST/PUT/DELETE /auth/product`, category routes,
  `GET /api/orders`) require a `Authorization: Bearer <token>` header. Get a
  token via `POST /auth/adminlogin` with the seeded admin credentials.
