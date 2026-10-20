const Item = require('../models/Item');

/**
 * @desc    Get all items with search & filtering
 * @route   GET /api/items
 * @access  Public
 */
const getItems = async (req, res) => {
  try {
    const {
      search,
      category,
      city,
      condition,
      status,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by city
    if (city && city !== 'All') {
      query.city = { $regex: new RegExp(`^${city.trim()}$`, 'i') };
    }

    // Filter by condition
    if (condition && condition !== 'All') {
      query.condition = condition;
    }

    // Filter by status (default: show Available & Reserved)
    if (status && status !== 'All') {
      query.status = status;
    }

    // Text search in title, description, or neighborhood
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { neighborhood: searchRegex },
        { city: searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .populate('user', 'name phone city neighborhood')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      items,
    });
  } catch (error) {
    console.error('getItems error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve listings.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single item details by ID
 * @route   GET /api/items/:id
 * @access  Public
 */
const getItemById = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('user', 'name phone city neighborhood createdAt');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item listing not found.',
      });
    }

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    console.error('getItemById error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch item details.',
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new donation item listing
 * @route   POST /api/items
 * @access  Private
 */
const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      condition,
      city,
      neighborhood,
      contactPhone,
      allowWhatsApp,
    } = req.body;

    if (!title || !category || !condition || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: Title, Category, Condition, and City.',
      });
    }

    // Process uploaded images
    let images = req.imageUrls || [];

    // Fallback: If user passed existing image URLs directly via body (e.g. testing)
    if (images.length === 0 && req.body.images) {
      if (Array.isArray(req.body.images)) {
        images = req.body.images;
      } else if (typeof req.body.images === 'string') {
        images = [req.body.images];
      }
    }

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one photo of the item.',
      });
    }

    const item = await Item.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      category,
      condition,
      images,
      city: city.trim(),
      neighborhood: neighborhood ? neighborhood.trim() : '',
      contactPhone: contactPhone ? contactPhone.trim() : req.user.phone,
      allowWhatsApp: allowWhatsApp !== undefined ? String(allowWhatsApp) === 'true' : true,
      status: 'Available',
      user: req.user._id,
      isFreeItemRuleAccepted: true,
    });

    const populatedItem = await Item.findById(item._id).populate(
      'user',
      'name phone city'
    );

    res.status(201).json({
      success: true,
      message: 'BarakAllah Feek! Your item has been listed for free donation.',
      item: populatedItem,
    });
  } catch (error) {
    console.error('createItem error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to list donation item.',
    });
  }
};

/**
 * @desc    Update item status ('Available', 'Reserved', 'Donated')
 * @route   PUT /api/items/:id/status
 * @access  Private (Owner only)
 */
const updateItemStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ['Available', 'Reserved', 'Donated'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    // Ensure the requester is the item's owner or an admin
    if (
      item.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized: You can only update your own items.',
      });
    }

    item.status = status;
    await item.save();

    res.status(200).json({
      success: true,
      message:
        status === 'Donated'
          ? 'Alhamdulillah! Item marked as successfully given away Fi Sabilillah.'
          : `Item status updated to ${status}.`,
      item,
    });
  } catch (error) {
    console.error('updateItemStatus error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update item status.',
    });
  }
};

/**
 * @desc    Delete an item listing
 * @route   DELETE /api/items/:id
 * @access  Private (Owner only)
 */
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    // Verify ownership
    if (
      item.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized: You can only delete your own listings.',
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Listing removed successfully.',
    });
  } catch (error) {
    console.error('deleteItem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete listing.',
    });
  }
};

/**
 * @desc    Get all items posted by the logged in user
 * @route   GET /api/items/user/my-items
 * @access  Private
 */
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error('getMyItems error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your posted items.',
    });
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItemStatus,
  deleteItem,
  getMyItems,
};
