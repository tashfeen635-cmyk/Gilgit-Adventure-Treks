require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./backend/config/db');

const app = express();

// Connect to MongoDB (cached for serverless)
const dbReady = connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// SEO & performance headers
app.use((req, res, next) => {
  // Security headers (also good for SEO trust signals)
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('X-DNS-Prefetch-Control', 'on');
  // Cache static assets aggressively (CSS, JS, images)
  const url = req.url;
  if (url.match(/\.(css|js|jpg|jpeg|png|gif|webp|svg|ico|woff2?)$/i)) {
    res.setHeader('Cache-Control', 'public, max-age=2592000, immutable'); // 30 days
  }
  next();
});

// SEO routes (robots.txt, sitemaps) — before static files
app.use('/', require('./backend/routes/seo'));

// Serve static files — public site
app.use(express.static(path.join(__dirname)));

// Serve admin panel
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Serve developer panel
app.use('/developer', express.static(path.join(__dirname, 'developer')));

// Combined public data endpoint — single request instead of 6 + site settings
app.get('/api/public-data', async (req, res) => {
  try {
    await dbReady;
    const SiteSettings = require('./backend/models/SiteSettings');
    const [destinations, reviews, deals, videos, gallery, team, settings] = await Promise.all([
      require('./backend/models/Destination').find().sort({ id: 1 }).lean(),
      require('./backend/models/Review').find({ $or: [{ status: 'approved' }, { status: { $exists: false } }] }).sort({ createdAt: -1 }).lean(),
      require('./backend/models/Deal').find().sort({ createdAt: -1 }).lean(),
      require('./backend/models/Video').find().sort({ sortOrder: 1 }).lean(),
      require('./backend/models/GalleryImage').find().sort({ sortOrder: 1 }).lean(),
      require('./backend/models/TeamMember').find().sort({ sortOrder: 1 }).lean(),
      SiteSettings.getSettings()
    ]);
    res.json({ destinations, reviews, deals, videos, gallery, team, settings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load data' });
  }
});

// Lightweight endpoint — only settings + specific collections (faster for subpages)
app.get('/api/page-data', async (req, res) => {
  try {
    await dbReady;
    const SiteSettings = require('./backend/models/SiteSettings');
    const need = (req.query.need || '').split(',').filter(Boolean);
    const queries = { settings: SiteSettings.getSettings() };

    if (need.includes('destinations')) queries.destinations = require('./backend/models/Destination').find().sort({ id: 1 }).lean();
    if (need.includes('reviews')) queries.reviews = require('./backend/models/Review').find({ $or: [{ status: 'approved' }, { status: { $exists: false } }] }).sort({ createdAt: -1 }).lean();
    if (need.includes('deals')) queries.deals = require('./backend/models/Deal').find().sort({ createdAt: -1 }).lean();
    if (need.includes('videos')) queries.videos = require('./backend/models/Video').find().sort({ sortOrder: 1 }).lean();
    if (need.includes('gallery')) queries.gallery = require('./backend/models/GalleryImage').find().sort({ sortOrder: 1 }).lean();
    if (need.includes('team')) queries.team = require('./backend/models/TeamMember').find().sort({ sortOrder: 1 }).lean();

    const keys = Object.keys(queries);
    const values = await Promise.all(keys.map(k => queries[k]));
    const result = {};
    keys.forEach((k, i) => { result[k] = values[i]; });
    res.json(result);
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
app.use('/api/contact', require('./backend/routes/contact'));
app.use('/api/videos', require('./backend/routes/videos'));
app.use('/api/gallery', require('./backend/routes/gallery'));
app.use('/api/team', require('./backend/routes/team'));

// Chat AI route
app.use('/api/chat', require('./backend/routes/chat'));

// Developer routes
app.use('/api/dev', require('./backend/routes/devAuth'));
app.use('/api/dev/settings', require('./backend/routes/siteSettings'));
app.use('/api/dev/admins', require('./backend/routes/devAdmin'));

// 404 handler — SEO-friendly error page
app.use((req, res) => {
  res.status(404).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found — Gilgit Adventure Treks</title>
  <meta name="robots" content="noindex, follow">
  <style>
    body { font-family: 'Times New Roman', serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f8fafc; color: #1B4332; text-align: center; }
    .container { max-width: 500px; padding: 2rem; }
    h1 { font-size: 4rem; margin: 0; color: #2D6A4F; }
    h2 { font-size: 1.5rem; margin: 0.5rem 0; }
    p { color: #64748b; line-height: 1.6; }
    a { color: #2D6A4F; text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; }
    .btn { display: inline-block; padding: 0.75rem 2rem; background: #2D6A4F; color: #fff; border-radius: 8px; margin-top: 1rem; }
    .btn:hover { background: #1B4332; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <h1>404</h1>
    <h2>Trail Not Found</h2>
    <p>Looks like this path doesn't lead anywhere. Even our best guides can't find this page! Let's get you back on track.</p>
    <a href="/" class="btn">Back to Base Camp</a>
    <p style="margin-top:2rem;"><a href="/destinations.html">Browse Destinations</a> &middot; <a href="/book.html">Book a Trek</a> &middot; <a href="/contact.html">Contact Us</a></p>
  </div>
</body>
</html>`);
});

const PORT = process.env.PORT || 3000;

// Start server (needed for Render and local dev)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for Vercel serverless
module.exports = app;
