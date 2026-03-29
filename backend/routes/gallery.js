const router = require('express').Router();
const GalleryImage = require('../models/GalleryImage');
const auth = require('../middleware/auth');

// GET /api/gallery (public)
router.get('/', async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ sortOrder: 1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/gallery (auth)
router.post('/', auth, async (req, res) => {
  try {
    const image = await GalleryImage.create(req.body);
    res.status(201).json(image);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/gallery/:id (auth)
router.put('/:id', auth, async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!image) return res.status(404).json({ message: 'Image not found' });
    res.json(image);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/gallery/:id (auth)
router.delete('/:id', auth, async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
