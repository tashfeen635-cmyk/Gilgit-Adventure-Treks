const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const devAuth = require('../middleware/devAuth');

// GET /api/dev/admins — List all admin accounts
router.get('/', devAuth, async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/dev/admins — Create a new admin
router.post('/', devAuth, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await Admin.findOne({ username: username.trim() });
    if (existing) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const admin = await Admin.create({ username: username.trim(), password });
    res.json({ message: 'Admin created', admin: { _id: admin._id, username: admin.username } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/dev/admins/:id/reset-password — Reset admin password
router.put('/:id/reset-password', devAuth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/dev/admins/:id — Delete an admin
router.delete('/:id', devAuth, async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json({ message: 'Admin deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
