const router = require('express').Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const optionalUserAuth = require('../middleware/optionalUserAuth');
const { sendBookingConfirmation } = require('../utils/mailer');

// POST /api/bookings (public, optionally authenticated)
router.post('/', optionalUserAuth, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.user) {
      data.userId = req.user.id;
    }
    const booking = await Booking.create(data);
    res.status(201).json(booking);

    // Send confirmation email in background (don't block response)
    if (booking.customerEmail) {
      sendBookingConfirmation(booking).catch(err => {
        console.error('[mailer] Booking confirmation email failed:', err.message);
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/bookings (auth)
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/bookings/:id (auth)
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/bookings/:id (auth)
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
