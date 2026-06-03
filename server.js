const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shophub';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✓ MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  category: String,
  rating: { type: Number, default: 5 },
  stock: Number,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }],
  totalPrice: Number,
  customerEmail: String,
  customerName: String,
  address: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// ============ PRODUCT ROUTES ============

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ ORDER ROUTES ============

// Create order
app.post('/api/orders', async (req, res) => {
  const { items, totalPrice, customerEmail, customerName, address } = req.body;
  const order = new Order({
    items,
    totalPrice,
    customerEmail,
    customerName,
    address
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ SEED ROUTE ============

// Seed sample products
app.post('/api/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const sampleProducts = [
      {
        name: 'Wireless Headphones',
        price: 79.99,
        description: 'High-quality wireless headphones with noise cancellation',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        category: 'Electronics',
        rating: 4.8,
        stock: 50
      },
      {
        name: 'Smart Watch',
        price: 199.99,
        description: 'Feature-rich smartwatch with health tracking',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        category: 'Electronics',
        rating: 4.6,
        stock: 30
      },
      {
        name: 'USB-C Cable',
        price: 12.99,
        description: 'Durable USB-C charging cable',
        image: 'https://images.unsplash.com/photo-1609034227505-5876f6aa4e90?w=400',
        category: 'Accessories',
        rating: 4.9,
        stock: 100
      },
      {
        name: 'Phone Case',
        price: 24.99,
        description: 'Premium protective phone case',
        image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
        category: 'Accessories',
        rating: 4.7,
        stock: 75
      },
      {
        name: 'Portable Charger',
        price: 49.99,
        description: 'Fast charging portable power bank',
        image: 'https://images.unsplash.com/photo-1609042231871-8a5a694d0e90?w=400',
        category: 'Electronics',
        rating: 4.5,
        stock: 45
      },
      {
        name: 'Screen Protector',
        price: 9.99,
        description: 'Tempered glass screen protector',
        image: 'https://images.unsplash.com/photo-1598301257657-5d02c7b83d1b?w=400',
        category: 'Accessories',
        rating: 4.8,
        stock: 200
      }
    ];

    await Product.insertMany(sampleProducts);
    res.json({ message: '✓ Sample products added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
