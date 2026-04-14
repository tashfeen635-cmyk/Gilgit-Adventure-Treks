const router = require('express').Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const connectDB = require('../config/db');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const LoginLog = require('../models/LoginLog');
const userAuth = require('../middleware/userAuth');
const { sendPasswordResetCode } = require('../utils/mailer');

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
    const ip = req.headers['x-forwarded-for'] || req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || '';

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      LoginLog.create({ userType: 'user', username: email, email, ip, userAgent, success: false, failReason: 'User not found' }).catch(() => {});
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      LoginLog.create({ userType: 'user', username: user.name, email, ip, userAgent, success: false, failReason: 'Wrong password' }).catch(() => {});
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Log successful login
    LoginLog.create({ userType: 'user', username: user.name, email, ip, userAgent, success: true }).catch(() => {});

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

// POST /api/users/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    await connectDB();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      const code = crypto.randomInt(100000, 999999).toString();
      user.resetCode = code;
      user.resetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      sendPasswordResetCode({ email: user.email, name: user.name, code }).catch(err => {
        console.error('[forgot-password] Email send error:', err.message);
      });
    }

    // Always return success to prevent email enumeration
    res.json({ message: 'If that email is registered, a verification code has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    await connectDB();
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Email, code, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.resetCode || !user.resetCodeExpiry) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    if (user.resetCode !== code.trim()) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    if (new Date() > user.resetCodeExpiry) {
      user.resetCode = null;
      user.resetCodeExpiry = null;
      await user.save();
      return res.status(400).json({ message: 'Reset code has expired. Please request a new one.' });
    }

    user.password = newPassword;
    user.resetCode = null;
    user.resetCodeExpiry = null;
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in with your new password.' });
  } catch (err) {
    console.error('Reset password error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
