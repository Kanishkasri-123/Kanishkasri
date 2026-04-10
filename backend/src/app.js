/**
 * app.js
 * Express application configuration.
 * Separated from server.js for easier testing and Vercel compatibility.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const matrimonyRoutes = require('./routes/matrimony.routes');
const adminRoutes = require('./routes/admin.routes');
const itTrainingRoutes = require('./routes/it-training.routes');
const realEstateRoutes = require('./routes/real-estate.routes');
const abroadRoutes = require('./routes/abroad.routes');
const groceriesRoutes = require('./routes/groceries.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// ── CORS ────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Very permissive for local development and specific URLs
      if (
        !origin || 
        origin.startsWith('http://localhost') || 
        origin.startsWith('http://127.0.0.1')
      ) {
        return callback(null, true);
      }
      
      // Automatically allow requests from any Vercel domain (the frontend and admin)
      if (origin && origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        process.env.ADMIN_URL,
      ].filter(Boolean);

      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// ── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// ── Static Files ─────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

// ── Root Welcome Route ───────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ success: true, message: 'Welcome to Sri Kanishka Associates API', version: '1.0.0' });
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/matrimony', matrimonyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/it-training', itTrainingRoutes);
app.use('/api/real-estate', realEstateRoutes);
app.use('/api/abroad', abroadRoutes);
app.use('/api/groceries', groceriesRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler (must be last) ──────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
