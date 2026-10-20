const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reason: {
      type: String,
      required: [true, 'Please select a reason for reporting'],
      enum: [
        'Asking for money / Commercial sale',
        'Fraud or scam attempt',
        'Inappropriate or offensive content',
        'Item no longer available / unreachable',
        'Wrong information or fake photos',
        'Other',
      ],
    },
    details: {
      type: String,
      trim: true,
      maxlength: [500, 'Details cannot exceed 500 characters'],
      default: '',
    },
    contactInfo: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Action Taken', 'Dismissed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Report', reportSchema);
