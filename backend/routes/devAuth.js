const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Developer = require('../models/Developer');
const devAuth = require('../middleware/devAuth');

// POST /api/dev/seed — Create first developer account (only if none exist)
router.post('/seed', async (req, res) => {
  try {
    const count = await Developer.countDocuments();
    if (count > 0) {
      return res.status(400).json({ message: 'Developer account already exists' });
    }

    const dev = await Developer.create({
      username: 'developer',
      password: 'dev123456'
    });

    res.json({ message: 'Developer account created', username: dev.username });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/dev/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const dev = await Developer.findOne({ username });
    if (!dev) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await dev.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: dev._id, username: dev.username },
      process.env.DEV_JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, username: dev.username });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/dev/me
router.get('/me', devAuth, async (req, res) => {
  try {
    const dev = await Developer.findById(req.developer.id).select('-password');
    if (!dev) return res.status(404).json({ message: 'Developer not found' });
    res.json(dev);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/dev/profile — change username and/or password
router.put('/profile', devAuth, async (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ message: 'Current password is required' });
    }

    const dev = await Developer.findById(req.developer.id);
    if (!dev) return res.status(404).json({ message: 'Developer not found' });

    const isMatch = await dev.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    if (newUsername && newUsername.trim()) {
      const existing = await Developer.findOne({ username: newUsername.trim(), _id: { $ne: dev._id } });
      if (existing) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      dev.username = newUsername.trim();
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
      }
      dev.password = newPassword;
    }

    await dev.save();

    const token = jwt.sign(
      { id: dev._id, username: dev.username },
      process.env.DEV_JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ message: 'Profile updated successfully', token, username: dev.username });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
