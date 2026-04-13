const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');
const ContactMessage = require('../models/ContactMessage');
const auth = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');
const { sendContactAutoReply, sendAdminNewMessageNotification } = require('../utils/mailer');

// POST /api/contact — public
router.post('/', validate(schemas.contact), async (req, res) => {
  try {
    await connectDB();
    const { name, email, phone, subject, message } = req.body;
    const msg = await ContactMessage.create({ name, email, phone, subject, message });

    // Send auto-reply before response (Vercel serverless)
    try {
      await sendContactAutoReply({ name, email, subject, message });
    } catch (err) {
      console.error('[mailer] Contact auto-reply failed:', err.message);
    }

    // Notify admin about new message
    try {
      await sendAdminNewMessageNotification({ name, email, phone, subject, message });
    } catch (err) {
      console.error('[mailer] Admin message notification failed:', err.message);
    }

    res.status(201).json({ message: 'Message sent successfully', id: msg._id });
  } catch (err) {
    console.error('Contact form error:', err.message);
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
});

// GET /api/contact — admin auth
router.get('/', auth, async (req, res) => {
  try {
    await connectDB();
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error('Get messages error:', err.message);
    res.status(500).json({ message: 'Failed to load messages', error: err.message });
  }
});

// PUT /api/contact/:id — admin auth
router.put('/:id', auth, async (req, res) => {
  try {
    await connectDB();
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json(msg);
  } catch (err) {
    console.error('Update message error:', err.message);
    res.status(500).json({ message: 'Failed to update message', error: err.message });
  }
});

// DELETE /api/contact/:id — admin auth
router.delete('/:id', auth, async (req, res) => {
  try {
    await connectDB();
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete message error:', err.message);
    res.status(500).json({ message: 'Failed to delete message', error: err.message });
  }
});

module.exports = router;
