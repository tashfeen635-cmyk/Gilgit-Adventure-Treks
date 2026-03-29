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
    id: 1, name: 'Hunza Valley', country: 'Gilgit-Baltistan', category: 'valley',
    image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=600&q=80',
    rating: 4.9, reviews: 3400, price: 45000,
    description: 'The crown jewel of Northern Pakistan. Hunza Valley offers jaw-dropping views of Rakaposhi, ancient Baltit Fort, and the stunning turquoise Attabad Lake. A paradise for photographers and culture lovers alike.',
    highlights: ['Baltit Fort', "Eagle's Nest Viewpoint", 'Attabad Lake', 'Rakaposhi View', 'Local Cuisine'],
    mapX: 700, mapY: 158
  },
  {
    id: 2, name: 'Skardu', country: 'Baltistan', category: 'valley',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    rating: 4.8, reviews: 2800, price: 55000,
    description: "Gateway to the world's highest peaks. Skardu is home to Shangrila Resort, the mesmerizing Upper & Lower Kachura Lakes, and serves as base camp for K2 and other 8,000m giants.",
    highlights: ['Shangrila Resort', 'Upper Kachura Lake', 'Skardu Fort', 'Cold Desert', 'Sarfaranga Desert'],
    mapX: 725, mapY: 172
  },
  {
    id: 3, name: 'Fairy Meadows', country: 'Diamer', category: 'trek', featured: true,
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80',
    rating: 4.9, reviews: 2100, price: 35000,
    description: 'A lush green alpine meadow offering an unobstructed front-row seat to Nanga Parbat, the 9th highest mountain on Earth. The jeep ride and trek to reach here are adventures in themselves.',
    highlights: ['Nanga Parbat View', 'Camping', 'Beyal Camp Trek', 'Star Gazing', 'Jeep Track Thrill'],
    mapX: 688, mapY: 178
  },
  {
    id: 4, name: 'Naltar Valley', country: 'Gilgit', category: 'lake', featured: true,
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&q=80',
    rating: 4.7, reviews: 1600, price: 30000,
    description: "Famous for its trio of stunning lakes that change color with the seasons — from deep blue to emerald green. Naltar also boasts Pakistan's highest ski resort and pristine pine forests.",
    highlights: ['Naltar Lakes', 'Ski Resort', 'Pine Forests', 'Camping', 'Photography'],
    mapX: 682, mapY: 152
  },
  {
    id: 5, name: 'K2 Base Camp', country: 'Baltistan', category: 'peak', featured: true,
    image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=600&q=80',
    rating: 4.9, reviews: 890, price: 180000,
    description: 'The ultimate trek for mountaineers and adventure purists. The K2 Base Camp trek takes you through Concordia — the throne room of the mountain gods — with views of four 8,000m peaks.',
    highlights: ['Concordia', 'Baltoro Glacier', 'Broad Peak View', 'Gasherbrum Views', 'Mountaineering'],
    mapX: 738, mapY: 162
  },
  {
    id: 6, name: 'Deosai National Park', country: 'Baltistan', category: 'trek', featured: true,
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80',
    rating: 4.8, reviews: 1350, price: 40000,
    description: 'The "Land of Giants" — one of the highest plateaus in the world at 4,114m. Home to the Himalayan brown bear, golden marmots, and wildflower-covered plains stretching to the horizon.',
    highlights: ['Sheosar Lake', 'Brown Bears', 'Wildflower Plains', 'Bara Pani', 'Wildlife Photography'],
    mapX: 722, mapY: 185
  },
  {
    id: 7, name: 'Passu & Gulmit', country: 'Upper Hunza', category: 'valley',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80',
    rating: 4.7, reviews: 1800, price: 38000,
    description: 'Home to the iconic Passu Cones and the thrilling Hussaini Suspension Bridge. This Upper Hunza gem features the dramatic Passu Glacier, Borith Lake, and timeless Wakhi culture.',
    highlights: ['Passu Cones', 'Hussaini Bridge', 'Passu Glacier', 'Borith Lake', 'Wakhi Culture'],
    mapX: 706, mapY: 142
  },
  {
    id: 8, name: 'Khunjerab Pass', country: 'Hunza', category: 'peak',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&q=80',
    rating: 4.6, reviews: 1400, price: 25000,
    description: 'The highest paved international border crossing in the world at 4,693m on the Pakistan-China border. Drive the legendary Karakoram Highway and spot wild yaks and Marco Polo sheep.',
    highlights: ['Highest Border Crossing', 'Karakoram Highway', 'Wild Yaks', 'Snow Peaks', 'KKH Drive'],
    mapX: 714, mapY: 132
  },
  {
    id: 9, name: 'Attabad Lake', country: 'Upper Hunza', category: 'lake',
    image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&q=80',
    rating: 4.8, reviews: 2200, price: 28000,
    description: "A stunning turquoise lake formed by a massive landslide in 2010. Today it's a paradise for boating, jet skiing, and photography with the Karakoram peaks reflected in its vivid waters.",
    highlights: ['Boat Rides', 'Jet Skiing', 'Photography', 'Turquoise Waters', 'Mountain Backdrop'],
    mapX: 695, mapY: 146
  },
  {
    id: 10, name: 'Phander Valley', country: 'Ghizer', category: 'lake',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80',
    rating: 4.7, reviews: 950, price: 32000,
    description: 'A hidden paradise in Ghizer District with the pristine Phander Lake, lush green meadows, and a serene atmosphere that feels untouched by time. One of the most peaceful spots in the north.',
    highlights: ['Phander Lake', 'Handrap Lake', 'Trout Fishing', 'Green Meadows', 'Peaceful Retreat'],
    mapX: 672, mapY: 168
  },
  {
    id: 11, name: 'Baltit & Altit Forts', country: 'Hunza', category: 'heritage',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80',
    rating: 4.6, reviews: 1700, price: 20000,
    description: 'Ancient seats of the Hunza Mirs dating back 700+ years. Baltit Fort sits dramatically above Karimabad while Altit Fort — the older of the two — overlooks the Hunza River gorge.',
    highlights: ['Baltit Fort', 'Altit Fort', 'Hunza History', 'Museum Tours', 'Karimabad Bazaar'],
    mapX: 698, mapY: 165
  },
  {
    id: 12, name: 'Rakaposhi Base Camp', country: 'Nagar', category: 'trek',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&q=80',
    rating: 4.8, reviews: 1100, price: 35000,
    description: 'A rewarding day trek to the base of the mighty Rakaposhi (7,788m). The trail passes through wildflower meadows and glacial streams with stunning panoramic views of the Karakoram.',
    highlights: ['Rakaposhi Views', 'Minapin Glacier', 'Day Trek', 'Wildflower Meadows', 'Mountain Streams'],
    mapX: 690, mapY: 170
  }
];

const reviews = [
  {
    name: 'Ahmed Raza', location: 'Lahore, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    rating: 5, destination: 'Hunza Valley', verified: true,
    text: "The Journey Team made our Hunza trip absolutely magical! The guide knew every hidden viewpoint. Watching sunrise over Rakaposhi from Eagle's Nest was a life-changing moment. Highly recommended!"
  },
  {
    name: 'Sarah Thompson', location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    rating: 5, destination: 'K2 Base Camp', verified: true,
    text: 'The K2 Base Camp trek was the adventure of a lifetime! The team was professional, porters were incredible, and seeing Concordia for the first time literally brought tears to my eyes. World-class operation.'
  },
  {
    name: 'Fatima Khan', location: 'Islamabad, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    rating: 5, destination: 'Fairy Meadows', verified: true,
    text: "Fairy Meadows was pure magic! Camping under billions of stars with Nanga Parbat towering above us. The food cooked by the local team was delicious. Best family trip we've ever taken."
  },
  {
    name: 'Marco Rossi', location: 'Milan, Italy',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    rating: 5, destination: 'Skardu', verified: true,
    text: 'Skardu exceeded every expectation. The drive on the Karakoram Highway, the turquoise lakes, the cold desert — it felt like another planet. The Journey Team arranged everything perfectly. Grazie mille!'
  },
  {
    name: 'Aisha Malik', location: 'Karachi, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    rating: 5, destination: 'Naltar Valley', verified: true,
    text: "Naltar's color-changing lakes are unreal — the photos don't do justice! The pine forests smelled incredible. Our guide from The Journey Team was so knowledgeable and friendly. Already planning our next trip!"
  },
  {
    name: 'David Chen', location: 'Toronto, Canada',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    rating: 5, destination: 'Deosai National Park', verified: true,
    text: 'Deosai is like nowhere else on Earth. We saw Himalayan brown bears, golden marmots, and the vast wildflower plains were breathtaking. The camping setup was comfortable and the guides were true professionals.'
  }
];

const now = Date.now();
const deals = [
  {
    name: 'Hunza Valley Explorer', destination: 'Hunza Valley',
    image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=600&q=80',
    oldPrice: 65000, newPrice: 45000, badge: 'Hot Deal',
    description: "5 days/4 nights — Karimabad, Attabad Lake, Eagle's Nest, Baltit Fort, all meals & transport.",
    expiresAt: new Date(now + 47 * 3600000)
  },
  {
    name: 'Skardu Lakes & Desert', destination: 'Skardu, Baltistan',
    image: 'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=600&q=80',
    oldPrice: 78000, newPrice: 55000, badge: 'Trending',
    description: '6 days/5 nights — Shangrila, Upper Kachura, Deosai Plains, Cold Desert, Skardu Fort.',
    expiresAt: new Date(now + 23 * 3600000)
  },
  {
    name: 'Fairy Meadows & Nanga Parbat', destination: 'Fairy Meadows',
    image: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=600&q=80',
    oldPrice: 50000, newPrice: 35000, badge: 'Best Seller',
    description: '4 days/3 nights — Jeep ride, trek to meadows, camping, Beyal Camp, Nanga Parbat views.',
    expiresAt: new Date(now + 71 * 3600000)
  },
  {
    name: 'Grand Northern Pakistan', destination: 'Hunza + Skardu + Fairy Meadows',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80',
    oldPrice: 150000, newPrice: 99000, badge: 'Save 34%',
    description: '12 days/11 nights — Complete Northern Areas experience with all highlights, meals & expert guides.',
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
  { name: 'Karim Shah', role: 'Founder & Lead Guide', bio: 'Born and raised in Gilgit. 15+ years leading treks across Karakoram, K2 Base Camp, and every valley in between.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', facebook: '#', instagram: '#', sortOrder: 1 },
  { name: 'Ayesha Mir', role: 'Operations & Travel Planner', bio: 'Masters in Tourism Management. Designs every itinerary with precision to ensure seamless, hassle-free adventures.', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80', facebook: '#', instagram: '#', sortOrder: 2 },
  { name: 'Hussain Ali', role: 'Senior Trek Guide', bio: 'Hunza native with summit experience on multiple 7,000m+ peaks. Certified mountaineer and wilderness first-aid specialist.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', facebook: '#', instagram: '#', sortOrder: 3 },
  { name: 'Zara Batool', role: 'Community & Marketing Lead', bio: 'Skardu local passionate about responsible tourism. Connects travelers with authentic cultural experiences across Baltistan.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', facebook: '#', instagram: '#', sortOrder: 4 }
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
