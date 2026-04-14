const router = require('express').Router();
const connectDB = require('../config/db');
const Destination = require('../models/Destination');
const auth = require('../middleware/auth');

// GET /api/destinations (public)
router.get('/', async (req, res) => {
  try {
    await connectDB();
    const destinations = await Destination.find().sort({ id: 1 });
    res.json(destinations);
  } catch (err) {
    console.error('Get destinations error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/destinations (auth)
router.post('/', auth, async (req, res) => {
  try {
    await connectDB();
    const destination = await Destination.create(req.body);
    res.status(201).json(destination);
  } catch (err) {
    console.error('Create destination error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/destinations/:id (auth)
router.put('/:id', auth, async (req, res) => {
  try {
    await connectDB();
    const destination = await Destination.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!destination) return res.status(404).json({ message: 'Destination not found' });
    res.json(destination);
  } catch (err) {
    console.error('Update destination error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/destinations/:id (auth)
router.delete('/:id', auth, async (req, res) => {
  try {
    await connectDB();
    const destination = await Destination.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!destination) return res.status(404).json({ message: 'Destination not found' });
    res.json({ message: 'Destination deleted' });
  } catch (err) {
    console.error('Delete destination error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
