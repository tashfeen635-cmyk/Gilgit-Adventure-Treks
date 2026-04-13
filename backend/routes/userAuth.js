const router = require('express').Router();
const jwt = require('jsonwebtoken');
const connectDB = require('../config/db');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const userAuth = require('../middleware/userAuth');

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    await connectDB();
    const { name, email, password, phone, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, phone: phone || '', avatar: avatar || '' });
    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, name: user.name, email: user.email, avatar: user.avatar });
  } catch (err) {
    console.error('User register error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, name: user.name, email: user.email, avatar: user.avatar || '' });
  } catch (err) {
    console.error('User login error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/users/me
router.get('/me', userAuth, async (req, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/users/me
router.put('/me', userAuth, async (req, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, phone, avatar, location, password } = req.body;
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    if (location !== undefined) user.location = location;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      user.password = password;
    }

    await user.save();
    const safeUser = user.toObject();
    delete safeUser.password;
    res.json(safeUser);
  } catch (err) {
    console.error('Update user error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// GET /api/users/my-bookings
router.get('/my-bookings', userAuth, async (req, res) => {
  try {
    await connectDB();
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('Get user bookings error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/users/my-reviews
router.get('/my-reviews', userAuth, async (req, res) => {
  try {
    await connectDB();
    const reviews = await Review.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error('Get user reviews error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
