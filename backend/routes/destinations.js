const router = require('express').Router();
const Destination = require('../models/Destination');
const auth = require('../middleware/auth');

// GET /api/destinations (public)
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ id: 1 });
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/destinations (auth)
router.post('/', auth, async (req, res) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json(destination);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/destinations/:id (auth)
router.put('/:id', auth, async (req, res) => {
  try {
    const destination = await Destination.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!destination) return res.status(404).json({ message: 'Destination not found' });
    res.json(destination);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/destinations/:id (auth)
router.delete('/:id', auth, async (req, res) => {
  try {
    const destination = await Destination.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!destination) return res.status(404).json({ message: 'Destination not found' });
    res.json({ message: 'Destination deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
