const router = require('express').Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');
const userAuth = require('../middleware/userAuth');
const { validate, schemas } = require('../middleware/validate');

// GET /api/reviews (public — approved + legacy only)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({
      $or: [{ status: 'approved' }, { status: { $exists: false } }]
    }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/reviews/all (admin — all reviews including pending)
router.get('/all', auth, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/reviews/user (user-submitted, pending approval)
router.post('/user', userAuth, validate(schemas.userReview), async (req, res) => {
  try {
    const { destination, rating, text } = req.body;
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const review = await Review.create({
      name: user.name,
      location: user.location || 'Pakistan',
      avatar: user.avatar || '',
      rating,
      destination,
      text,
      verified: false,
      userId: user._id,
      status: 'pending'
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/reviews (auth)
router.post('/', auth, async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/reviews/:id (auth)
router.put('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/reviews/:id (auth)
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
