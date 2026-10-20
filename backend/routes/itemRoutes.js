const express = require('express');
const router = express.Router();
const {
  getItems,
  getItemById,
  createItem,
  updateItemStatus,
  deleteItem,
  getMyItems,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const {
  upload,
  processUploadedImages,
} = require('../middleware/uploadMiddleware');

// Get all items & Create new item
router
  .route('/')
  .get(getItems)
  .post(protect, upload.array('images', 5), processUploadedImages, createItem);

// Get current user's posted items
router.get('/user/my-items', protect, getMyItems);

// Single item routes
router
  .route('/:id')
  .get(getItemById)
  .delete(protect, deleteItem);

// Update item status ('Available', 'Reserved', 'Donated')
router.put('/:id/status', protect, updateItemStatus);

module.exports = router;
