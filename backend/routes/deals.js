const router = require('express').Router();
const Deal = require('../models/Deal');
const auth = require('../middleware/auth');

// GET /api/deals (public)
router.get('/', async (req, res) => {
  try {
    const deals = await Deal.find().sort({ createdAt: -1 }).lean();
    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/deals (auth)
router.post('/', auth, async (req, res) => {
  try {
    const deal = await Deal.create(req.body);
    res.status(201).json(deal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/deals/:id (auth)
router.put('/:id', auth, async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    res.json(deal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/deals/:id (auth)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    res.json({ message: 'Deal deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
