/**
 * groceries.routes.js
 * Endpoints for Premium Groceries.
 */
const { Router } = require('express');
const router = Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const db = require('../config/db');

// Setup multer for images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, `grocery-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

// POST /api/groceries/products
router.post('/products', upload.single('image'), async (req, res, next) => {
  try {
    const { name, brand, category, mrp, selling_price, weight, stock, description, status, tags } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const id = 'GRC-' + uuidv4().substring(0, 8).toUpperCase();
    const discount = mrp && selling_price ? (((mrp - selling_price) / mrp) * 100).toFixed(2) : 0;

    await db.query(
      `INSERT INTO groceries_products 
       (id, name, brand, category, mrp, selling_price, discount_percent, weight, stock, description, image_url, status, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        id, name, brand || '', category || 'Uncategorized', 
        mrp || 0, selling_price || 0, discount, 
        weight || '', stock || 0, description || '', 
        imageUrl, status || 'in-stock', tags || ''
      ]
    );

    res.json({ success: true, message: 'Product added successfully!', product: { id, name } });
  } catch (err) {
    next(err);
  }
});

// GET /api/groceries/products
router.get('/products', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM groceries_products ORDER BY "createdAt" DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
