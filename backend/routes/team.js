const router = require('express').Router();
const TeamMember = require('../models/TeamMember');
const auth = require('../middleware/auth');

// GET /api/team (public)
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ sortOrder: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/team (auth)
router.post('/', auth, async (req, res) => {
  try {
    const member = await TeamMember.create(req.body);
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/team/:id (auth)
router.put('/:id', auth, async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) return res.status(404).json({ message: 'Team member not found' });
    res.json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/team/:id (auth)
router.delete('/:id', auth, async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Team member not found' });
    res.json({ message: 'Team member deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
