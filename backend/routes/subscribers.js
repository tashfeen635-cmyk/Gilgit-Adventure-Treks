const router = require('express').Router();
const Subscriber = require('../models/Subscriber');
const auth = require('../middleware/auth');

// POST /api/subscribers (public)
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const existing = await Subscriber.findOne({ email });
    if (existing) return res.json({ message: 'Already subscribed' });

    const subscriber = await Subscriber.create({ email });
    res.status(201).json(subscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/subscribers (auth)
router.get('/', auth, async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/subscribers/:id (auth)
router.delete('/:id', auth, async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) return res.status(404).json({ message: 'Subscriber not found' });
    res.json({ message: 'Subscriber deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
