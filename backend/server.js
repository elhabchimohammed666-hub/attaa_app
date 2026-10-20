const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Initialize Express
const app = express();

// Connect Database
connectDB();

// Security and Logging Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow serving images cross-origin
  })
);
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    platform: 'Attaa - Free Community Gifting',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/reports', reportRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`,
  });
});

// Global Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Attaa API Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`✨ Mode: ${process.env.NODE_ENV || 'development'}`);
});
