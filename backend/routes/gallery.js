const router = require('express').Router();
const connectDB = require('../config/db');
const GalleryImage = require('../models/GalleryImage');
const auth = require('../middleware/auth');

// GET /api/gallery (public)
router.get('/', async (req, res) => {
  try {
    await connectDB();
    const images = await GalleryImage.find().sort({ sortOrder: 1 });
    res.json(images);
  } catch (err) {
    console.error('Get gallery error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/gallery (auth)
router.post('/', auth, async (req, res) => {
  try {
    await connectDB();
    const image = await GalleryImage.create(req.body);
    res.status(201).json(image);
  } catch (err) {
    console.error('Create gallery image error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/gallery/:id (auth)
router.put('/:id', auth, async (req, res) => {
  try {
    await connectDB();
    const image = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!image) return res.status(404).json({ message: 'Image not found' });
    res.json(image);
  } catch (err) {
    console.error('Update gallery image error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/gallery/:id (auth)
router.delete('/:id', auth, async (req, res) => {
  try {
    await connectDB();
    const image = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    res.json({ message: 'Image deleted' });
  } catch (err) {
    console.error('Delete gallery image error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
