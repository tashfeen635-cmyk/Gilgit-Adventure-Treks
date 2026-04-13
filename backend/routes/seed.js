const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const Review = require('../models/Review');
const Deal = require('../models/Deal');
const Video = require('../models/Video');
const GalleryImage = require('../models/GalleryImage');
const TeamMember = require('../models/TeamMember');
const Admin = require('../models/Admin');

// Seed data
const videos = [
  { title: 'Gilgit Adventure Treks', description: 'Discover the breathtaking landscapes of Northern Pakistan', tag: 'Cinematic', videoUrl: 'videos/Gilgit Adventure Treks-1.mp4', sortOrder: 1 },
  { title: 'Mountain Adventures', description: 'Real trekking experiences through the Karakoram', tag: 'Client Story', videoUrl: 'videos/Gilgit Adventure Treks-2.mp4', sortOrder: 2 },
  { title: 'Valleys & Lakes', description: 'Stunning views of Hunza, Skardu, and beyond', tag: 'Destination', videoUrl: 'videos/Gilgit Adventure Treks-3.mp4', sortOrder: 3 },
  { title: 'The Karakoram Highway', description: "Pakistan's most scenic drive through the mountains", tag: 'Cinematic', videoUrl: 'videos/Gilgit Adventure Treks-4.mp4', sortOrder: 4 },
  { title: 'Fairy Meadows Camping', description: 'Camping under the stars beneath Nanga Parbat', tag: 'Client Story', videoUrl: 'videos/Gilgit Adventure Treks-5.mp4', sortOrder: 5 },
  { title: 'Naltar Valley', description: 'Drone footage of the stunning tri-colored lakes', tag: 'Destination', videoUrl: 'videos/Gilgit Adventure Treks-6.mp4', sortOrder: 6 },
  { title: 'K2 Base Camp Trek', description: 'The ultimate journey to Concordia and beyond', tag: 'Cinematic', videoUrl: 'videos/Gilgit Adventure Treks-7.mp4', sortOrder: 7 },
  { title: 'Hunza Valley Explorer', description: "A family's unforgettable journey through Hunza", tag: 'Client Story', videoUrl: 'videos/Gilgit Adventure Treks-8.mp4', sortOrder: 8 },
  { title: 'Deosai National Park', description: 'The Land of Giants — wildflowers and wildlife', tag: 'Destination', videoUrl: 'videos/Gilgit Adventure Treks-9.mp4', sortOrder: 9 },
  { title: 'Skardu & Beyond', description: 'Shangrila, cold deserts, and turquoise lakes', tag: 'Cinematic', videoUrl: 'videos/Gilgit Adventure Treks-10.mp4', sortOrder: 10 }
];

const galleryImages = [
  { imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80', altText: 'Mountain peaks', hidden: false, sortOrder: 1 },
  { imageUrl: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=400&q=80', altText: 'Valley view', hidden: false, sortOrder: 2 },
  { imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', altText: 'Skardu landscape', hidden: false, sortOrder: 3 },
  { imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&q=80', altText: 'Mountain road', hidden: false, sortOrder: 4 },
  { imageUrl: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=400&q=80', altText: 'Northern scenery', hidden: false, sortOrder: 5 },
  { imageUrl: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&q=80', altText: 'Naltar Valley', hidden: false, sortOrder: 6 },
  { imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80', altText: 'Deosai Plains', hidden: false, sortOrder: 7 },
  { imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80', altText: 'Starry mountains', hidden: false, sortOrder: 8 },
  { imageUrl: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=400&q=80', altText: 'Hunza Valley', hidden: false, sortOrder: 9 },
  { imageUrl: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=400&q=80', altText: 'K2 region', hidden: false, sortOrder: 10 },
  { imageUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&q=80', altText: 'Attabad Lake', hidden: false, sortOrder: 11 },
  { imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80', altText: 'Phander Valley', hidden: true, sortOrder: 12 },
  { imageUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=400&q=80', altText: 'Rakaposhi', hidden: true, sortOrder: 13 },
  { imageUrl: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=400&q=80', altText: 'Trek path', hidden: true, sortOrder: 14 },
  { imageUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&q=80', altText: 'Snow peaks', hidden: true, sortOrder: 15 },
  { imageUrl: 'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=400&q=80', altText: 'Mountain sunset', hidden: true, sortOrder: 16 },
  { imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80', altText: 'Northern lights', hidden: true, sortOrder: 17 }
];

const teamMembers = [
  { name: 'Karim Shah', role: 'Founder & Lead Guide', bio: 'Born and raised in Gilgit. 15+ years leading treks across Karakoram, K2 Base Camp, and every valley in between.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', facebook: '#', instagram: '#', sortOrder: 1 },
  { name: 'Ayesha Mir', role: 'Operations & Travel Planner', bio: 'Masters in Tourism Management. Designs every itinerary with precision to ensure seamless, hassle-free adventures.', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80', facebook: '#', instagram: '#', sortOrder: 2 },
  { name: 'Hussain Ali', role: 'Senior Trek Guide', bio: 'Hunza native with summit experience on multiple 7,000m+ peaks. Certified mountaineer and wilderness first-aid specialist.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', facebook: '#', instagram: '#', sortOrder: 3 },
  { name: 'Zara Batool', role: 'Community & Marketing Lead', bio: 'Skardu local passionate about responsible tourism. Connects travelers with authentic cultural experiences across Baltistan.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', facebook: '#', instagram: '#', sortOrder: 4 }
];

// Seed admin account (safe to run multiple times) - GET and POST
const seedAdminHandler = async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });

    if (existingAdmin) {
      return res.json({
        message: 'Admin account already exists',
        username: 'admin'
      });
    }

    // Create default admin
    const admin = new Admin({
      username: 'admin',
      password: process.env.ADMIN_DEFAULT_PASSWORD || 'admin123'
    });

    await admin.save();

    res.json({
      success: true,
      message: 'Admin account created successfully',
      username: 'admin',
      password: 'Use ADMIN_DEFAULT_PASSWORD from environment variables'
    });
  } catch (err) {
    console.error('Admin seed error:', err);
    res.status(500).json({ error: err.message });
  }
};

router.get('/seed-admin', seedAdminHandler);
router.post('/seed-admin', seedAdminHandler);

// Debug endpoint to check environment variables
router.get('/check-env', async (req, res) => {
  try {
    res.json({
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasAdminPassword: !!process.env.ADMIN_DEFAULT_PASSWORD,
      jwtSecretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
      nodeEnv: process.env.NODE_ENV || 'not set',
      adminCount: await Admin.countDocuments()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test login endpoint with detailed error reporting
router.post('/test-login', async (req, res) => {
  try {
    const jwt = require('jsonwebtoken');
    const { username, password } = req.body;

    // Step 1: Check inputs
    if (!username || !password) {
      return res.json({ step: 1, error: 'Username and password are required' });
    }

    // Step 2: Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.json({ step: 2, error: 'Admin not found', username });
    }

    // Step 3: Compare password
    let isMatch;
    try {
      isMatch = await admin.comparePassword(password);
    } catch (err) {
      return res.json({ step: 3, error: 'Password comparison failed', message: err.message });
    }

    if (!isMatch) {
      return res.json({ step: 3, error: 'Password does not match' });
    }

    // Step 4: Generate token
    let token;
    try {
      token = jwt.sign(
        { id: admin._id, username: admin.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
    } catch (err) {
      return res.json({ step: 4, error: 'Token generation failed', message: err.message });
    }

    // Success
    res.json({ success: true, token, username: admin.username });
  } catch (err) {
    res.json({ step: 0, error: 'Server error', message: err.message, stack: err.stack });
  }
});

// Seed only gallery and videos (safe to run multiple times)
router.post('/seed-media', async (req, res) => {
  try {
    // Check if already seeded
    const videoCount = await Video.countDocuments();
    const galleryCount = await GalleryImage.countDocuments();
    const teamCount = await TeamMember.countDocuments();

    if (videoCount > 0 && galleryCount > 0 && teamCount > 0) {
      return res.json({
        message: 'Database already has media data',
        videos: videoCount,
        gallery: galleryCount,
        team: teamCount
      });
    }

    // Seed videos if empty
    if (videoCount === 0) {
      await Video.insertMany(videos);
    }

    // Seed gallery if empty
    if (galleryCount === 0) {
      await GalleryImage.insertMany(galleryImages);
    }

    // Seed team if empty
    if (teamCount === 0) {
      await TeamMember.insertMany(teamMembers);
    }

    res.json({
      success: true,
      message: 'Media seeded successfully',
      videos: videos.length,
      gallery: galleryImages.length,
      team: teamMembers.length
    });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
