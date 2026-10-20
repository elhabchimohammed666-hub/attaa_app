const Report = require('../models/Report');
const Item = require('../models/Item');

/**
 * @desc    Submit a report for an item listing (Fraud, asking for money, etc.)
 * @route   POST /api/reports
 * @access  Public (Optional auth)
 */
const createReport = async (req, res) => {
  try {
    const { itemId, reason, details, contactInfo } = req.body;

    if (!itemId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both the item ID and the reason for reporting.',
      });
    }

    const itemExists = await Item.findById(itemId);
    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: 'Item listing not found.',
      });
    }

    const report = await Report.create({
      item: itemId,
      reportedBy: req.user ? req.user._id : null,
      reason,
      details: details ? details.trim() : '',
      contactInfo: contactInfo ? contactInfo.trim() : '',
    });

    res.status(201).json({
      success: true,
      message:
        'Thank you for keeping our community safe. Our moderation team has received your report.',
      report,
    });
  } catch (error) {
    console.error('createReport error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit report.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all reports (Admin moderation)
 * @route   GET /api/reports
 * @access  Private / Admin
 */
const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('item', 'title category city images status')
      .populate('reportedBy', 'name phone email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve reports.',
    });
  }
};

module.exports = {
  createReport,
  getReports,
};
