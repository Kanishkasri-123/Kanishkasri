/**
 * abroad.routes.js
 * Endpoints for Abroad Consultancy enquiries.
 */

const { Router } = require('express');
const router = Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

// POST /api/abroad/enquiry
router.post('/enquiry', async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, country, preferredDate, preferredTime, message } = req.body;

    if (!firstName || !email || !phone) {
      return res.status(400).json({ success: false, message: 'First name, email, and phone are required.' });
    }

    const id = 'ABR-' + uuidv4().substring(0, 8).toUpperCase();

    await db.query(
      `INSERT INTO abroad_enquiries (id, "firstName", "lastName", email, phone, country, "preferredDate", "preferredTime", message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [id, firstName, lastName || '', email, phone, country || '', preferredDate || '', preferredTime || '', message || '']
    );

    res.json({ success: true, message: 'Enquiry submitted successfully! We will contact you soon.' });
  } catch (err) {
    next(err);
  }
});

// GET /api/abroad/enquiries
// Admin only fetching endpoint
router.get('/enquiries', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM abroad_enquiries ORDER BY "createdAt" DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/abroad/enquiries/:id/status
router.patch('/enquiries/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.query('UPDATE abroad_enquiries SET status = $1 WHERE id = $2', [status, id]);
    res.json({ success: true, message: 'Status updated.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
