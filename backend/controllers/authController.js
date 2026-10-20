const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate signed JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'attaa_super_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, phone, email, password, city, neighborhood } = req.body;

    if (!name || !phone || !password || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (Name, Phone, City, Password).',
      });
    }

    // Check if phone already registered
    const existingPhone = await User.findOne({ phone: phone.trim() });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'An account with this phone number already exists. Please log in.',
      });
    }

    // Check if email already registered (if provided)
    if (email && email.trim()) {
      const existingEmail = await User.findOne({ email: email.trim().toLowerCase() });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }
    }

    const user = await User.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email && email.trim() ? email.trim().toLowerCase() : undefined,
      password,
      city: city.trim(),
      neighborhood: neighborhood ? neighborhood.trim() : '',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to the Attaa community.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        city: user.city,
        neighborhood: user.neighborhood,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating your account.',
    });
  }
};

/**
 * @desc    Authenticate user & get token (Login via Phone OR Email)
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your Phone or Email, and your password.',
      });
    }

    const cleanIdentifier = identifier.trim();

    // Find by phone OR by email
    const user = await User.findOne({
      $or: [
        { phone: cleanIdentifier },
        { email: cleanIdentifier.toLowerCase() },
      ],
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your phone/email and password.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your phone/email and password.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Welcome back!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        city: user.city,
        neighborhood: user.neighborhood,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during authentication.',
    });
  }
};

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile.',
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const { name, phone, city, neighborhood } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();
    if (city) user.city = city.trim();
    if (neighborhood !== undefined) user.neighborhood = neighborhood.trim();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile.',
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};
