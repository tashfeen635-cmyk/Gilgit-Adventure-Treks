const router = require('express').Router();
const SiteSettings = require('../models/SiteSettings');
const devAuth = require('../middleware/devAuth');

// GET /api/dev/settings — Get all site settings
router.get('/', devAuth, async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load settings' });
  }
});

// PUT /api/dev/settings — Update site settings (partial update)
router.put('/', devAuth, async (req, res) => {
  try {
    const settings = await SiteSettings.updateSettings(req.body);
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

// GET /api/site-settings — Public endpoint (no auth)
router.get('/public', async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load settings' });
  }
});

module.exports = router;
