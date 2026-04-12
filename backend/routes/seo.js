const express = require('express');
const router = express.Router();

// ─── robots.txt ───
router.get('/robots.txt', async (req, res) => {
  try {
    const SiteSettings = require('../models/SiteSettings');
    const settings = await SiteSettings.getSettings();
    const baseUrl = (settings.seo && settings.seo.canonicalUrl) || `https://${req.hostname}`;

    const robots = `# Gilgit Adventure Treks — robots.txt
# Last updated: ${new Date().toISOString().split('T')[0]}

User-agent: *
Allow: /
Allow: /css/
Allow: /js/
Allow: /images/

# Block admin panel
Disallow: /admin/
Disallow: /api/

# Block auth pages from indexing
Disallow: /login.html
Disallow: /register.html
Disallow: /profile.html

# Block query parameters
Disallow: /*?*

# Crawl-delay (be gentle on the server)
Crawl-delay: 2

# Sitemaps
Sitemap: ${baseUrl}/sitemap-index.xml

# Allow image crawling for Google Images
User-agent: Googlebot-Image
Allow: /images/
`;

    res.type('text/plain').send(robots);
  } catch (err) {
    res.type('text/plain').send('User-agent: *\nAllow: /\n');
  }
});

// ─── Sitemap Index ───
router.get('/sitemap-index.xml', async (req, res) => {
  try {
    const SiteSettings = require('../models/SiteSettings');
    const settings = await SiteSettings.getSettings();
    const baseUrl = (settings.seo && settings.seo.canonicalUrl) || `https://${req.hostname}`;
    const now = new Date().toISOString();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-pages.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-destinations.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-images.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-videos.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

    res.type('application/xml').send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap index');
  }
});

// ─── Pages Sitemap (static pages) ───
router.get('/sitemap-pages.xml', async (req, res) => {
  try {
    const SiteSettings = require('../models/SiteSettings');
    const settings = await SiteSettings.getSettings();
    const baseUrl = (settings.seo && settings.seo.canonicalUrl) || `https://${req.hostname}`;
    const now = new Date().toISOString();

    const pages = [
      { loc: '/', priority: '1.0', changefreq: 'daily' },
      { loc: '/destinations.html', priority: '0.9', changefreq: 'weekly' },
      { loc: '/jeep-safaris.html', priority: '0.9', changefreq: 'weekly' },
      { loc: '/book.html', priority: '0.9', changefreq: 'weekly' },
      { loc: '/deals.html', priority: '0.8', changefreq: 'daily' },
      { loc: '/reviews.html', priority: '0.7', changefreq: 'weekly' },
      { loc: '/trip-planner.html', priority: '0.8', changefreq: 'monthly' },
      { loc: '/contact.html', priority: '0.6', changefreq: 'monthly' }
    ];

    let urls = '';
    pages.forEach(p => {
      urls += `  <url>
    <loc>${baseUrl}${p.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>\n`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}</urlset>`;

    res.type('application/xml').send(xml);
  } catch (err) {
    res.status(500).send('Error generating pages sitemap');
  }
});

// ─── Destinations Sitemap ───
router.get('/sitemap-destinations.xml', async (req, res) => {
  try {
    const SiteSettings = require('../models/SiteSettings');
    const Destination = require('../models/Destination');
    const settings = await SiteSettings.getSettings();
    const baseUrl = (settings.seo && settings.seo.canonicalUrl) || `https://${req.hostname}`;

    const destinations = await Destination.find().sort({ id: 1 });

    let urls = '';
    destinations.forEach(d => {
      const slug = d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const priority = d.featured ? '0.9' : '0.7';
      const lastmod = d.updatedAt ? d.updatedAt.toISOString() : new Date().toISOString();

      urls += `  <url>
    <loc>${baseUrl}/destinations.html?highlight=${encodeURIComponent(d.name)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
    <image:image>
      <image:loc>${d.image.startsWith('http') ? d.image : baseUrl + '/' + d.image}</image:loc>
      <image:title>${escapeXml(d.name)} — ${escapeXml(d.country)}</image:title>
      <image:caption>${escapeXml(d.description.substring(0, 200))}</image:caption>
      <image:geo_location>${escapeXml(d.country)}</image:geo_location>
    </image:image>
  </url>\n`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}</urlset>`;

    res.type('application/xml').send(xml);
  } catch (err) {
    res.status(500).send('Error generating destinations sitemap');
  }
});

// ─── Images Sitemap ───
router.get('/sitemap-images.xml', async (req, res) => {
  try {
    const SiteSettings = require('../models/SiteSettings');
    const GalleryImage = require('../models/GalleryImage');
    const settings = await SiteSettings.getSettings();
    const baseUrl = (settings.seo && settings.seo.canonicalUrl) || `https://${req.hostname}`;

    const images = await GalleryImage.find({ hidden: { $ne: true } }).sort({ sortOrder: 1 });

    let urls = '';
    images.forEach(img => {
      const lastmod = img.updatedAt ? img.updatedAt.toISOString() : new Date().toISOString();
      urls += `  <url>
    <loc>${baseUrl}/#gallery</loc>
    <lastmod>${lastmod}</lastmod>
    <image:image>
      <image:loc>${img.imageUrl.startsWith('http') ? img.imageUrl : baseUrl + '/' + img.imageUrl}</image:loc>
      <image:title>${escapeXml(img.altText || 'Northern Pakistan Adventure Photo')}</image:title>
      <image:caption>${escapeXml(img.altText || 'Gilgit Adventure Treks Gallery')}</image:caption>
      <image:geo_location>Gilgit-Baltistan, Pakistan</image:geo_location>
    </image:image>
  </url>\n`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}</urlset>`;

    res.type('application/xml').send(xml);
  } catch (err) {
    res.status(500).send('Error generating images sitemap');
  }
});

// ─── Videos Sitemap ───
router.get('/sitemap-videos.xml', async (req, res) => {
  try {
    const SiteSettings = require('../models/SiteSettings');
    const Video = require('../models/Video');
    const settings = await SiteSettings.getSettings();
    const baseUrl = (settings.seo && settings.seo.canonicalUrl) || `https://${req.hostname}`;

    const videos = await Video.find().sort({ sortOrder: 1 });

    let urls = '';
    videos.forEach(v => {
      const lastmod = v.updatedAt ? v.updatedAt.toISOString() : new Date().toISOString();
      urls += `  <url>
    <loc>${baseUrl}/#videos</loc>
    <lastmod>${lastmod}</lastmod>
    <video:video>
      <video:title>${escapeXml(v.title)}</video:title>
      <video:description>${escapeXml(v.description || v.title)}</video:description>
      <video:content_loc>${escapeXml(v.videoUrl)}</video:content_loc>
      <video:family_friendly>yes</video:family_friendly>
      <video:tag>${escapeXml(v.tag || 'pakistan trekking')}</video:tag>
      <video:category>Travel &amp; Events</video:category>
    </video:video>
  </url>\n`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls}</urlset>`;

    res.type('application/xml').send(xml);
  } catch (err) {
    res.status(500).send('Error generating videos sitemap');
  }
});

// Helper: escape XML special characters
function escapeXml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
}

module.exports = router;
