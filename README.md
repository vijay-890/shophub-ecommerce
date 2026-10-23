# ShopHub E-Commerce

A full-stack online store demo built with HTML, CSS, vanilla JavaScript, Node.js, Express, and MongoDB.

## Features

- Searchable product catalogue
- Shopping cart and wishlist
- Product reviews and ratings
- Newsletter form and order management UI
- Responsive storefront

## Run locally

1. Install Node.js and MongoDB, or create a MongoDB Atlas database.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and set `MONGO_URI` to your database connection string.
4. Start the server with `npm start`.
5. Open `http://localhost:3000`.

Keep `.env` local. Only the placeholder `.env.example` belongs in Git.

## API routes

- `GET /api/products` — list products
- `GET /api/products/:id` — fetch one product
- `POST /api/orders` — create an order
- `GET /api/orders` — list orders
- `POST /api/seed` — add sample data

## Project structure

- `server.js` — Express and MongoDB server
- `public/` — storefront assets
- `.env.example` — safe local configuration template
