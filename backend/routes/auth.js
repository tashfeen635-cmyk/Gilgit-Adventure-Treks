const router = require('express').Router();
const jwt = require('jsonwebtoken');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const User = require('../models/User');
const LoginLog = require('../models/LoginLog');
const auth = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    // CRITICAL: Wait for DB connection first (Vercel serverless fix)
    await connectDB();

    const { username, password } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || '';

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      LoginLog.create({ userType: 'admin', username, ip, userAgent, success: false, failReason: 'User not found' }).catch(() => {});
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      LoginLog.create({ userType: 'admin', username, ip, userAgent, success: false, failReason: 'Wrong password' }).catch(() => {});
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Log successful login
    LoginLog.create({ userType: 'admin', username, ip, userAgent, success: true }).catch(() => {});

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, username: admin.username });
  } catch (err) {
    console.error('Login error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    // CRITICAL: Wait for DB connection first (Vercel serverless fix)
    await connectDB();

    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    console.error('Get admin error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/auth/profile — change username and/or password
router.put('/profile', auth, async (req, res) => {
  try {
    // CRITICAL: Wait for DB connection first (Vercel serverless fix)
    await connectDB();

    const { currentPassword, newUsername, newPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ message: 'Current password is required' });
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    if (newUsername && newUsername.trim()) {
      const existing = await Admin.findOne({ username: newUsername.trim(), _id: { $ne: admin._id } });
      if (existing) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      admin.username = newUsername.trim();
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
      }
      admin.password = newPassword;
    }

    await admin.save();

    // Issue new token with updated username
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ message: 'Profile updated successfully', token, username: admin.username });
  } catch (err) {
    console.error('Profile update error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/auth/users — Admin-only: list all registered users
router.get('/users', auth, async (req, res) => {
  try {
    await connectDB();
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('List users error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/auth/users/:id — Admin-only: delete a user
router.delete('/users/:id', auth, async (req, res) => {
  try {
    await connectDB();
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/auth/login-logs — Admin-only: view all login history
router.get('/login-logs', auth, async (req, res) => {
  try {
    await connectDB();
    const logs = await LoginLog.find().sort({ createdAt: -1 }).limit(200);
    res.json(logs);
  } catch (err) {
    console.error('Login logs error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
