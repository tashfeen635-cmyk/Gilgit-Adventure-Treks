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
    id: 1, name: 'Gilgit Valley', country: 'Pakistan', category: 'valley',
    image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80',
    rating: 4.9, reviews: 340, price: 45000,
    description: 'Explore the heart of Gilgit-Baltistan with breathtaking mountain views, ancient forts, and the confluence of three great mountain ranges — Karakoram, Himalayas, and Hindu Kush.',
    highlights: ['Kargah Buddha Rock', 'Gilgit River Rafting', 'Karakoram Highway Drive', 'Local Bazaar Tour', 'Gilgit Fort'],
    mapX: 700, mapY: 158, featured: true
  },
  {
    id: 2, name: 'Skardu & Shangrila', country: 'Pakistan', category: 'valley',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    rating: 4.9, reviews: 280, price: 55000,
    description: 'Discover the magical Skardu valley — home to Shangrila Resort, Upper & Lower Kachura Lakes, the Cold Desert, and gateway to the mighty K2 and the world\'s highest peaks.',
    highlights: ['Shangrila Resort', 'Upper Kachura Lake', 'Cold Desert Skardu', 'Skardu Fort', 'Satpara Lake'],
    mapX: 725, mapY: 172, featured: true
  },
  {
    id: 3, name: 'Fairy Meadows', country: 'Pakistan', category: 'trek', featured: true,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    rating: 4.9, reviews: 210, price: 35000,
    description: 'Camp under a billion stars with the mighty Nanga Parbat (8,126m) as your backdrop. Fairy Meadows is a lush green alpine meadow accessible via a thrilling jeep ride and 2-3 hour trek.',
    highlights: ['Nanga Parbat Base Camp', 'Star Gazing', 'Alpine Meadow Camping', 'Beyal Camp Trek', 'Raikot Bridge'],
    mapX: 688, mapY: 178
  },
  {
    id: 4, name: 'Naltar Valley', country: 'Pakistan', category: 'valley', featured: true,
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&q=80',
    rating: 4.8, reviews: 160, price: 40000,
    description: 'Famous for its tri-colored lakes that change hues with the seasons, Naltar Valley also hosts Pakistan\'s only ski resort. Pine forests, wildflowers, and crystal-clear streams await.',
    highlights: ['Naltar Lakes', 'Naltar Ski Resort', 'Pine Forest Walks', 'Wildflower Meadows', 'Drone Photography Spots'],
    mapX: 682, mapY: 152
  },
  {
    id: 5, name: 'K2 Base Camp', country: 'Pakistan', category: 'trek', featured: true,
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&q=80',
    rating: 4.9, reviews: 89, price: 180000,
    description: 'The ultimate mountaineering adventure — trek to Concordia and the base of K2 (8,611m), the world\'s second-highest peak. A 14-18 day expedition through the most dramatic landscapes on Earth.',
    highlights: ['Concordia Views', 'Baltoro Glacier Trek', 'Four 8000m Peaks', 'Askole Village', 'Gondogoro La Pass'],
    mapX: 738, mapY: 162
  },
  {
    id: 6, name: 'Deosai National Park', country: 'Pakistan', category: 'lake', featured: true,
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80',
    rating: 4.8, reviews: 135, price: 30000,
    description: 'The "Land of Giants" — one of the highest plateaus in the world at 4,114m. Home to the Himalayan brown bear, golden marmots, and endless fields of wildflowers in summer.',
    highlights: ['Sheosar Lake', 'Brown Bear Spotting', 'Wildflower Fields', 'Bara Pani', 'Night Sky Photography'],
    mapX: 722, mapY: 185
  },
  {
    id: 7, name: 'Attabad Lake & Passu', country: 'Pakistan', category: 'lake',
    image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&q=80',
    rating: 4.7, reviews: 180, price: 38000,
    description: 'The stunning turquoise Attabad Lake, the iconic Passu Cones, and the thrilling Hussaini Suspension Bridge. A photographer\'s paradise along the Karakoram Highway.',
    highlights: ['Attabad Lake Boating', 'Passu Cones Viewpoint', 'Hussaini Suspension Bridge', 'Borith Lake', 'Passu Glacier'],
    mapX: 706, mapY: 142
  },
  {
    id: 8, name: 'Swat Valley', country: 'Pakistan', category: 'heritage',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&q=80',
    rating: 4.6, reviews: 140, price: 25000,
    description: 'Known as the "Switzerland of Pakistan", Swat Valley offers lush green landscapes, Buddhist ruins, Malam Jabba ski resort, and the scenic beauty of Kalam and Mahodand Lake.',
    highlights: ['Malam Jabba Ski Resort', 'Kalam Valley', 'Mahodand Lake', 'Fizagat Park', 'Buddhist Ruins'],
    mapX: 714, mapY: 132
  },
];

const reviews = [
  {
    name: 'Ahmed Raza', location: 'Lahore, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    rating: 5, destination: 'Gilgit Valley', verified: true,
    text: "Gilgit Adventure Treks made our Northern Pakistan trip absolutely magical! The Karakoram Highway drive was breathtaking, the guides were knowledgeable, and every detail was perfectly planned. Highly recommended!"
  },
  {
    name: 'Sarah Thompson', location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    rating: 5, destination: 'Skardu & Shangrila', verified: true,
    text: 'Skardu was beyond anything I imagined! Shangrila Resort, the cold desert, and those turquoise lakes — all world-class. The team arranged everything perfectly from transport to accommodation.'
  },
  {
    name: 'Fatima Khan', location: 'Islamabad, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    rating: 5, destination: 'Fairy Meadows', verified: true,
    text: "Camping at Fairy Meadows under Nanga Parbat was a life-changing experience! The trek was well-organized, the camping gear was excellent, and waking up to that mountain view — absolutely unforgettable."
  },
  {
    name: 'Marco Rossi', location: 'Milan, Italy',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    rating: 5, destination: 'K2 Base Camp', verified: true,
    text: 'The K2 Base Camp trek was the adventure of a lifetime! Walking through the Baltoro Glacier with four 8000m peaks around us — no words can describe it. Best trekking company in Pakistan!'
  },
  {
    name: 'Aisha Malik', location: 'Karachi, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    rating: 5, destination: 'Naltar Valley', verified: true,
    text: "The tri-colored lakes of Naltar were absolutely stunning! Every shade of blue and green you can imagine. The pine forests, fresh mountain air, and peaceful atmosphere — pure paradise!"
  },
  {
    name: 'David Chen', location: 'Toronto, Canada',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    rating: 5, destination: 'Deosai National Park', verified: true,
    text: 'Deosai was like stepping onto another planet! We spotted Himalayan brown bears, saw millions of wildflowers, and Sheosar Lake at sunset was the most beautiful thing I have ever seen.'
  }
];

const now = Date.now();
const deals = [
  {
    name: 'Fairy Meadows Camping Special', destination: 'Fairy Meadows',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    oldPrice: 45000, newPrice: 35000, badge: 'Hot Deal',
    description: "3-day camping trip to Fairy Meadows — includes trek guide, camping gear, meals, and Nanga Parbat Base Camp visit.",
    expiresAt: new Date(now + 47 * 3600000)
  },
  {
    name: 'Skardu Explorer Package', destination: 'Skardu & Shangrila',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    oldPrice: 70000, newPrice: 55000, badge: 'Trending',
    description: '5-day Skardu tour — Shangrila Resort, Upper Kachura Lake, Cold Desert, Satpara Lake, and Deosai day trip included.',
    expiresAt: new Date(now + 23 * 3600000)
  },
  {
    name: 'Naltar Valley Getaway', destination: 'Naltar Valley',
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&q=80',
    oldPrice: 50000, newPrice: 40000, badge: 'Best Seller',
    description: '3-day trip to the stunning tri-colored lakes of Naltar — transport, meals, and photography guide included.',
    expiresAt: new Date(now + 71 * 3600000)
  },
  {
    name: 'Swat Valley Family Tour', destination: 'Swat Valley',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&q=80',
    oldPrice: 35000, newPrice: 25000, badge: 'Save 28%',
    description: '4-day family-friendly Swat tour — Kalam, Mahodand Lake, Malam Jabba, and Fizagat Park with comfortable stays.',
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
  { name: 'Karim Shah', role: 'Founder & Lead Guide', bio: 'Born and raised in Gilgit with 15+ years of mountain guiding experience. Has led expeditions to K2 Base Camp, Fairy Meadows, and across all of Gilgit-Baltistan.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', sortOrder: 1 },
  { name: 'Ayesha Mir', role: 'Operations & Tour Manager', bio: 'Masters in Tourism Management. Handles all tour logistics, client relations, and ensures every trip runs smoothly from booking to return.', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80', sortOrder: 2 },
  { name: 'Hussain Ali', role: 'Senior Trek Guide', bio: 'Expert mountaineer and certified high-altitude guide. Specializes in K2 Base Camp treks, Deosai expeditions, and adventure photography tours.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', sortOrder: 3 },
  { name: 'Zara Batool', role: 'Customer Experience Lead', bio: 'Ensures every traveler has an unforgettable experience. Handles itinerary customization, traveler support, and post-trip feedback.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', sortOrder: 4 }
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
