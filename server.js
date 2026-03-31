require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./backend/config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Serve static files — public site
app.use(express.static(path.join(__dirname)));

// Serve admin panel
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Serve developer panel
app.use('/developer', express.static(path.join(__dirname, 'developer')));

// Combined public data endpoint — single request instead of 6 + site settings
app.get('/api/public-data', async (req, res) => {
  try {
    const SiteSettings = require('./backend/models/SiteSettings');
    const [destinations, reviews, deals, videos, gallery, team, settings] = await Promise.all([
      require('./backend/models/Destination').find().sort({ id: 1 }),
      require('./backend/models/Review').find({ $or: [{ status: 'approved' }, { status: { $exists: false } }] }).sort({ createdAt: -1 }),
      require('./backend/models/Deal').find().sort({ createdAt: -1 }),
      require('./backend/models/Video').find().sort({ sortOrder: 1 }),
      require('./backend/models/GalleryImage').find().sort({ sortOrder: 1 }),
      require('./backend/models/TeamMember').find().sort({ sortOrder: 1 }),
      SiteSettings.getSettings()
    ]);
    res.json({ destinations, reviews, deals, videos, gallery, team, settings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load data' });
  }
});

// API Routes
app.use('/api/users', require('./backend/routes/userAuth'));
app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/destinations', require('./backend/routes/destinations'));
app.use('/api/reviews', require('./backend/routes/reviews'));
app.use('/api/deals', require('./backend/routes/deals'));
app.use('/api/bookings', require('./backend/routes/bookings'));
app.use('/api/subscribers', require('./backend/routes/subscribers'));
app.use('/api/videos', require('./backend/routes/videos'));
app.use('/api/gallery', require('./backend/routes/gallery'));
app.use('/api/team', require('./backend/routes/team'));

// Developer routes
app.use('/api/dev', require('./backend/routes/devAuth'));
app.use('/api/dev/settings', require('./backend/routes/siteSettings'));
app.use('/api/dev/admins', require('./backend/routes/devAdmin'));

const PORT = process.env.PORT || 3000;

// Only listen when running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
