const router = require('express').Router();
const connectDB = require('../config/db');
const Subscriber = require('../models/Subscriber');
const auth = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');
const { sendSubscriberConfirmation } = require('../utils/mailer');

// POST /api/subscribers (public)
router.post('/', validate(schemas.subscriber), async (req, res) => {
  try {
    await connectDB();
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const normalizedEmail = String(email).toLowerCase().trim();
    const cleanName = name ? String(name).trim() : '';

    const existing = await Subscriber.findOne({ email: normalizedEmail });
    if (existing) {
      // Still try to resend confirmation so the user gets their welcome email
      try {
        await sendSubscriberConfirmation({ email: normalizedEmail, name: cleanName || existing.name });
      } catch (mailErr) {
        console.error('[subscribers] Failed to resend confirmation:', mailErr.message);
      }
      return res.json({ message: 'Already subscribed', emailSent: true });
    }

    const subscriber = await Subscriber.create({ email: normalizedEmail, name: cleanName });

    // Send confirmation email (non-blocking for the response if it fails)
    let emailSent = false;
    try {
      const result = await sendSubscriberConfirmation({ email: normalizedEmail, name: cleanName });
      emailSent = !!result.sent;
    } catch (mailErr) {
      console.error('[subscribers] Failed to send confirmation:', mailErr.message);
    }

    res.status(201).json({ ...subscriber.toObject(), emailSent });
  } catch (err) {
    console.error('Subscribe error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// GET /api/subscribers (auth)
router.get('/', auth, async (req, res) => {
  try {
    await connectDB();
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (err) {
    console.error('Get subscribers error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/subscribers/:id (auth)
router.delete('/:id', auth, async (req, res) => {
  try {
    await connectDB();
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) return res.status(404).json({ message: 'Subscriber not found' });
    res.json({ message: 'Subscriber deleted' });
  } catch (err) {
    console.error('Delete subscriber error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
