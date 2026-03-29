const router = require('express').Router();
const Video = require('../models/Video');
const auth = require('../middleware/auth');

// GET /api/videos (public)
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ sortOrder: 1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/videos (auth)
router.post('/', auth, async (req, res) => {
  try {
    const video = await Video.create(req.body);
    res.status(201).json(video);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/videos/:id (auth)
router.put('/:id', auth, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/videos/:id (auth)
router.delete('/:id', auth, async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json({ message: 'Video deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
