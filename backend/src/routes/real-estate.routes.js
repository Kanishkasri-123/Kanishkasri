const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all listings
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM real_estate_listings ORDER BY "createdAt" DESC');
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching real estate listings:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Create new listing
router.post('/', async (req, res) => {
    try {
        const { id, sellerId, title, price, location, category, type, size, description, contact, seller, img, documentName, document, date } = req.body;
        
        await db.query(`
            INSERT INTO real_estate_listings (id, "sellerId", title, price, location, category, type, size, description, contact, seller, img, "documentName", document, date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        `, [id || Date.now().toString(), sellerId, title, price, location, category, type, size, description, contact, seller, img, documentName, document, date]);
        
        res.status(201).json({ success: true, message: 'Listing created' });
    } catch (err) {
        console.error('Error creating real estate listing:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete listing
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM real_estate_listings WHERE id = $1', [req.params.id]);
        res.json({ success: true, message: 'Listing deleted' });
    } catch (err) {
        console.error('Error deleting listing:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
