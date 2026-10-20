const express = require('express');
const router = express.Router();
const { createReport, getReports } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// Public or optionally authenticated report submission
router.post('/', createReport);

// Admin-only listing of reports
router.get('/', protect, getReports);

module.exports = router;
