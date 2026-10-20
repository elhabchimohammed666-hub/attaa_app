const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: [
          'Clothing',
          'Home & Furniture',
          'Electronics',
          'Books',
          'Kids & Toys',
          'Appliances',
          'Others',
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    condition: {
      type: String,
      required: [true, 'Please specify the item condition'],
      enum: {
        values: ['New', 'Excellent', 'Good', 'Needs Minor Repair'],
        message: '{VALUE} is not a valid condition',
      },
    },
    images: {
      type: [String],
      validate: {
        validator: function (val) {
          return val && val.length >= 1 && val.length <= 5;
        },
        message: 'Please provide between 1 and 5 images',
      },
    },
    city: {
      type: String,
      required: [true, 'Please provide the city where the item is located'],
      trim: true,
    },
    neighborhood: {
      type: String,
      trim: true,
      default: '',
    },
    contactPhone: {
      type: String,
      required: [true, 'Please provide a contact phone number'],
      trim: true,
    },
    allowWhatsApp: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Donated'],
      default: 'Available',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isFreeItemRuleAccepted: {
      type: Boolean,
      default: true,
      required: [
        true,
        'You must confirm that this item is 100% FREE with NO monetary exchange.',
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance search and filtering
itemSchema.index({ category: 1, city: 1, status: 1 });
itemSchema.index({ title: 'text', description: 'text', city: 'text' });

module.exports = mongoose.model('Item', itemSchema);
