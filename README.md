# ShopHub E-Commerce

Modern e-commerce website built with HTML, CSS, JavaScript, Node.js, Express, and MongoDB.

## Features

✅ Product catalog with search & filters
✅ Shopping cart
✅ Wishlist/Favorites
✅ Product reviews & ratings
✅ Newsletter signup
✅ Order management
✅ Responsive design
✅ MongoDB integration

## Installation

```bash
npm install
```

## Setup

1. Install MongoDB (or use MongoDB Atlas)
2. Update `.env` with MongoDB URI
3. Run `npm start`
4. Visit `http://localhost:3000`

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders
- `POST /api/seed` - Seed sample data

## Project Structure

```
.
├── package.json
├── server.js
├── .env
└── public/
    ├── index.html
    ├── styles.css
    └── app.js
```

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Node.js
- Express.js
- MongoDB
- Mongoose
