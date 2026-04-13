require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Destination = require('./models/Destination');
const Review = require('./models/Review');
const Deal = require('./models/Deal');
const Admin = require('./models/Admin');
const Video = require('./models/Video');
const GalleryImage = require('./models/GalleryImage');
const TeamMember = require('./models/TeamMember');

const destinations = [
  {
    id: 1, name: 'Wedding Films', country: 'Premium Package', category: 'wedding',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    rating: 4.9, reviews: 340, price: 150000,
    description: 'Capture your special day with cinematic excellence. Our wedding film package includes full-day coverage, drone shots, highlight reel, and complete ceremony documentation with professional editing.',
    highlights: ['Full-Day Coverage', 'Drone Cinematography', 'Highlight Reel', 'Professional Editing', 'Raw Footage Delivery'],
    mapX: 700, mapY: 158, featured: true
  },
  {
    id: 2, name: 'Corporate Videos', country: 'Business Package', category: 'corporate',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80',
    rating: 4.8, reviews: 280, price: 120000,
    description: 'Elevate your brand with professional corporate videos. Perfect for company profiles, product launches, training materials, and promotional content with scriptwriting and voiceover included.',
    highlights: ['Scriptwriting', 'Professional Voiceover', 'Motion Graphics', 'Multi-Camera Setup', 'Brand Integration'],
    mapX: 725, mapY: 172, featured: true
  },
  {
    id: 3, name: 'Music Videos', country: 'Creative Package', category: 'music', featured: true,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80',
    rating: 4.9, reviews: 210, price: 180000,
    description: 'Bring your music to life with stunning visuals. From concept development to final edit, we create music videos that capture your artistic vision with creative cinematography and professional color grading.',
    highlights: ['Concept Development', 'Location Scouting', 'Creative Cinematography', 'Color Grading', 'VFX Integration'],
    mapX: 688, mapY: 178
  },
  {
    id: 4, name: 'Event Coverage', country: 'Live Package', category: 'event', featured: true,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80',
    rating: 4.7, reviews: 160, price: 80000,
    description: 'Professional coverage for conferences, seminars, concerts, and special events. Multi-camera setup, live switching, and same-day highlights reel to capture every important moment.',
    highlights: ['Multi-Camera Setup', 'Live Streaming', 'Same-Day Highlights', 'Audio Recording', 'Event Recap Video'],
    mapX: 682, mapY: 152
  },
  {
    id: 5, name: 'Documentary Production', country: 'Premium Package', category: 'documentary', featured: true,
    image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=600&q=80',
    rating: 4.9, reviews: 89, price: 250000,
    description: 'Tell compelling stories with our documentary production service. Research, interviews, archival footage integration, and narrative-driven editing for impactful storytelling.',
    highlights: ['Research & Planning', 'Interview Setup', 'Archival Integration', 'Narrative Editing', 'Sound Design'],
    mapX: 738, mapY: 162
  },
  {
    id: 6, name: 'Photography Services', country: 'Photo Package', category: 'photography', featured: true,
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80',
    rating: 4.8, reviews: 135, price: 50000,
    description: 'Professional photography for portraits, products, events, and commercial shoots. Includes pre-production planning, full-day shoot, and professionally edited high-resolution images.',
    highlights: ['Portrait Photography', 'Product Shoots', 'Event Coverage', 'Professional Editing', 'High-Res Delivery'],
    mapX: 722, mapY: 185
  },
  {
    id: 7, name: 'Commercial Ads', country: 'Advertising Package', category: 'commercial',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&q=80',
    rating: 4.7, reviews: 180, price: 200000,
    description: 'Create impactful commercial advertisements for TV, digital platforms, and social media. From storyboarding to final delivery, we craft ads that convert viewers into customers.',
    highlights: ['Storyboarding', 'Professional Actors', 'Studio Setup', 'Motion Graphics', 'Multi-Platform Delivery'],
    mapX: 706, mapY: 142
  },
  {
    id: 8, name: 'Branding & Social Media', country: 'Digital Package', category: 'branding',
    image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&q=80',
    rating: 4.6, reviews: 140, price: 60000,
    description: 'Build your brand identity with engaging social media content. Short-form videos, reels, stories, and branded content optimized for Instagram, TikTok, YouTube, and Facebook.',
    highlights: ['Social Media Reels', 'Brand Story Videos', 'Content Calendar', 'Platform Optimization', 'Engagement Boost'],
    mapX: 714, mapY: 132
  },
];

const reviews = [
  {
    name: 'Ahmed Raza', location: 'Lahore, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    rating: 5, destination: 'Wedding Films', verified: true,
    text: "Gilgit Adventure Treks made our wedding film absolutely magical! They captured every precious moment beautifully. The drone shots were stunning and the editing was cinematic. Highly recommended!"
  },
  {
    name: 'Sarah Thompson', location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    rating: 5, destination: 'Corporate Videos', verified: true,
    text: 'The corporate video production was world-class! Professional team, creative direction, and the final product exceeded our expectations. Our brand story came to life beautifully.'
  },
  {
    name: 'Fatima Khan', location: 'Islamabad, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    rating: 5, destination: 'Event Coverage', verified: true,
    text: "They covered our conference perfectly! Multi-camera setup, professional editing, and same-day highlights. The team was unobtrusive yet captured everything. Best production team we've worked with."
  },
  {
    name: 'Marco Rossi', location: 'Milan, Italy',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    rating: 5, destination: 'Music Videos', verified: true,
    text: 'My music video turned out incredible! Creative cinematography, stunning locations, perfect color grading. The team understood my artistic vision completely. Grazie mille!'
  },
  {
    name: 'Aisha Malik', location: 'Karachi, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    rating: 5, destination: 'Photography Services', verified: true,
    text: "The product photography was stunning! Every detail captured perfectly, professional lighting, and the edited images exceeded expectations. Already planning our next shoot!"
  },
  {
    name: 'David Chen', location: 'Toronto, Canada',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    rating: 5, destination: 'Documentary Production', verified: true,
    text: 'Our documentary came out amazing! Compelling storytelling, professional interviews, beautiful cinematography. The team was patient, creative, and delivered a truly impactful film.'
  }
];

const now = Date.now();
const deals = [
  {
    name: 'Wedding Season Special', destination: 'Wedding Films',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    oldPrice: 180000, newPrice: 150000, badge: 'Hot Deal',
    description: "Full wedding coverage — ceremony, mehndi, reception. Includes drone shots, highlight reel, and full-day coverage.",
    expiresAt: new Date(now + 47 * 3600000)
  },
  {
    name: 'Corporate Package Deal', destination: 'Corporate Videos',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80',
    oldPrice: 150000, newPrice: 120000, badge: 'Trending',
    description: 'Company profile + 2 product videos — professional voiceover, motion graphics, and multi-camera setup included.',
    expiresAt: new Date(now + 23 * 3600000)
  },
  {
    name: 'Music Video Bundle', destination: 'Music Videos',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80',
    oldPrice: 200000, newPrice: 180000, badge: 'Best Seller',
    description: 'Creative concept + full production — includes location scouting, cinematography, and color grading.',
    expiresAt: new Date(now + 71 * 3600000)
  },
  {
    name: 'Social Media Starter', destination: 'Branding & Social Media',
    image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&q=80',
    oldPrice: 80000, newPrice: 60000, badge: 'Save 25%',
    description: '20 short-form videos — reels, stories, and posts optimized for Instagram, TikTok, and Facebook.',
    expiresAt: new Date(now + 35 * 3600000)
  }
];

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
  { name: 'Karim Shah', role: 'Founder & Creative Director', bio: 'Award-winning filmmaker from Gilgit with 15+ years of experience in cinematic production. Specializes in wedding films and documentaries.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', sortOrder: 1 },
  { name: 'Ayesha Mir', role: 'Producer & Operations Lead', bio: 'Masters in Film Production. Manages all project logistics, client relations, and ensures every production runs smoothly from concept to delivery.', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80', sortOrder: 2 },
  { name: 'Hussain Ali', role: 'Lead Cinematographer', bio: 'Expert in drone cinematography and multi-camera setups. Certified DJI pilot with experience shooting corporate videos and music productions.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', sortOrder: 3 },
  { name: 'Zara Batool', role: 'Editor & Post-Production', bio: 'Professional video editor specializing in color grading, motion graphics, and cinematic storytelling. Creates compelling narratives through editing.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', sortOrder: 4 }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Destination.deleteMany({}),
      Review.deleteMany({}),
      Deal.deleteMany({}),
      Admin.deleteMany({}),
      Video.deleteMany({}),
      GalleryImage.deleteMany({}),
      TeamMember.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Seed data
    await Destination.insertMany(destinations);
    console.log(`Seeded ${destinations.length} destinations`);

    await Review.insertMany(reviews);
    console.log(`Seeded ${reviews.length} reviews`);

    await Deal.insertMany(deals);
    console.log(`Seeded ${deals.length} deals`);

    await Video.insertMany(videos);
    console.log(`Seeded ${videos.length} videos`);

    await GalleryImage.insertMany(galleryImages);
    console.log(`Seeded ${galleryImages.length} gallery images`);

    await TeamMember.insertMany(teamMembers);
    console.log(`Seeded ${teamMembers.length} team members`);

    // Create default admin
    const password = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
    await Admin.create({ username: 'admin', password });
    console.log('Seeded admin user (admin / ' + password + ')');

    console.log('\nSeed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
