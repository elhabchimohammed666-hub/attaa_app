const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

// Ensure uploads folder exists for local storage fallback
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Memory storage if Cloudinary configured, Disk storage if local fallback
const storage = isCloudinaryConfigured
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadsDir);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `item-${uniqueSuffix}${ext}`);
      },
    });

// File filter: accept only standard image mime types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per image
    files: 5, // Up to 5 images
  },
  fileFilter: fileFilter,
});

/**
 * Helper to upload buffer to Cloudinary
 */
const uploadBufferToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'attaa_items',
        resource_type: 'image',
        public_id: filename.replace(/\.[^/.]+$/, ''),
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Middleware that processes uploaded files and attaches an array of public URLs to req.imageUrls
 */
const processUploadedImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      req.imageUrls = [];
      return next();
    }

    if (isCloudinaryConfigured) {
      const uploadPromises = req.files.map((file) =>
        uploadBufferToCloudinary(file.buffer, file.originalname)
      );
      req.imageUrls = await Promise.all(uploadPromises);
    } else {
      // Local fallback: produce relative public paths e.g. /uploads/item-12345.jpg
      req.imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
    }

    next();
  } catch (error) {
    console.error('Image upload processing failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process item images',
      error: error.message,
    });
  }
};

module.exports = {
  upload,
  processUploadedImages,
};
