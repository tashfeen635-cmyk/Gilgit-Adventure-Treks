const router = require('express').Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const optionalUserAuth = require('../middleware/optionalUserAuth');
const { validate, schemas } = require('../middleware/validate');
const { sendBookingConfirmation, sendAdminNewBookingNotification } = require('../utils/mailer');

// POST /api/bookings (public, optionally authenticated)
router.post('/', optionalUserAuth, validate(schemas.booking), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.user) {
      data.userId = req.user.id;
    }
    const booking = await Booking.create(data);

    // Send confirmation email BEFORE response (Vercel kills function after res.json)
    let emailSent = false;
    if (booking.customerEmail) {
      try {
        const result = await sendBookingConfirmation(booking);
        emailSent = result.sent;
        if (!emailSent) console.warn('[mailer] Email not sent:', result.reason);
      } catch (err) {
        console.error('[mailer] Booking confirmation email failed:', err.message);
      }
    }

    // Notify admin about new booking
    try {
      await sendAdminNewBookingNotification(booking);
    } catch (err) {
      console.error('[mailer] Admin booking notification failed:', err.message);
    }

    res.status(201).json({ ...booking.toObject(), emailSent });
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
