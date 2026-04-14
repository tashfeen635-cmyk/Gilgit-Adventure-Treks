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
  // ── TOUR PACKAGES (5 real itineraries) ──
  {
    id: 1, name: 'Blossom Jeep Safari', country: 'Pakistan', category: 'tour',
    image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80',
    rating: 4.9, reviews: 340, price: 85000,
    description: 'A 10-day spring jeep safari through the blossom-covered valleys of Northern Pakistan. Witness cherry and apricot blossoms at Fairy Meadows, Hunza Valley, and the Khunjerab Pass — the highest paved border crossing in the world.',
    highlights: ['Cherry & Apricot Blossoms', 'Fairy Meadows', 'Khunjerab Pass (4,693m)', 'Karakoram Highway', 'Gupis & Phandar Valley'],
    mapX: 700, mapY: 158, featured: true,
    duration: '10 Days / 9 Nights',
    priceUSD: '$600–650/person',
    groupSize: '6–15 people',
    bestSeason: 'Spring (March–April)',
    difficulty: 'Easy',
    route: ['Islamabad', 'Fairy Meadows', 'Hunza Valley', 'Khunjerab Pass', 'Gupis', 'Phandar', 'Islamabad'],
    itinerary: [
      { day: '1', title: 'Islamabad to Chilas', description: 'Depart Islamabad via Karakoram Highway. Drive along the Indus River to Chilas.' },
      { day: '2', title: 'Chilas to Fairy Meadows', description: 'Jeep ride to Tato Village, then trek to Fairy Meadows with Nanga Parbat views.' },
      { day: '3', title: 'Fairy Meadows to Karimabad', description: 'Return to KKH and drive to Karimabad, Hunza. Visit Baltit Fort.' },
      { day: '4', title: 'Hunza Valley Exploration', description: 'Visit Eagle\'s Nest viewpoint, Altit Fort, and the blossom-filled terraces.' },
      { day: '5', title: 'Hunza to Khunjerab Pass', description: 'Drive to the China border at 4,693m. See yaks and stunning glacier panoramas.' },
      { day: '6', title: 'Khunjerab to Gulmit & Passu', description: 'Explore Passu Cones, Hussaini Bridge, and Borith Lake.' },
      { day: '7', title: 'Passu to Gupis', description: 'Cross Shandur direction toward Gupis via Gilgit. Scenic riverside drive.' },
      { day: '8', title: 'Gupis & Phandar Lake', description: 'Boat ride on Phandar Lake, walk through blooming orchards and terraces.' },
      { day: '9', title: 'Gupis to Chilas', description: 'Return drive via Gilgit to Chilas. Evening rest and local dinner.' },
      { day: '10', title: 'Chilas to Islamabad', description: 'Final drive back to Islamabad via KKH. Tour concludes.' }
    ],
    includes: ['Transport (Coaster/Jeep)', 'Accommodation (hotels & guest houses)', 'All meals (breakfast, lunch, dinner)', 'Experienced tour guide', 'Permits & entry fees', 'First aid kit'],
    excludes: ['International/domestic flights', 'Personal expenses', 'Travel insurance', 'Tips & gratuities', 'Sleeping bag (available for rent)']
  },
  {
    id: 2, name: 'K2 Base Camp & Gondogoro La Trek', country: 'Pakistan', category: 'tour',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&q=80',
    rating: 4.9, reviews: 89, price: 350000,
    description: 'The ultimate 18–21 day expedition to the base of K2 (8,611m), the world\'s second-highest peak. Trek through the mighty Baltoro Glacier to Concordia, cross the challenging Gondogoro La pass (5,585m), and descend through Hushe Valley.',
    highlights: ['K2 Base Camp (5,150m)', 'Concordia Junction', 'Gondogoro La Pass (5,585m)', 'Baltoro Glacier', 'Four 8,000m+ Peaks'],
    mapX: 738, mapY: 162, featured: true,
    duration: '18–21 Days',
    priceUSD: '$2,350/person',
    groupSize: '4–12 people',
    bestSeason: 'Summer (June–August)',
    difficulty: 'Extreme',
    route: ['Islamabad', 'Skardu', 'Askole', 'Jhola', 'Urdokas', 'Goro II', 'Concordia', 'K2 Base Camp', 'Concordia', 'Gondogoro La', 'Hushe', 'Skardu', 'Islamabad'],
    itinerary: [
      { day: '1', title: 'Arrive Islamabad', description: 'Team briefing, gear check, and overnight in Islamabad.' },
      { day: '2', title: 'Fly to Skardu', description: 'Scenic flight over the Karakoram (or drive via KKH if weather delays).' },
      { day: '3', title: 'Skardu Exploration', description: 'Rest day. Visit Skardu Fort, Shangrila, and Upper Kachura Lake.' },
      { day: '4', title: 'Skardu to Askole', description: 'Jeep ride to Askole (3,040m), the last village before the trek.' },
      { day: '5', title: 'Askole to Jhola', description: 'Trek along the Braldu River gorge. Camp at Jhola (3,200m).' },
      { day: '6', title: 'Jhola to Paiju', description: 'Cross river and trek to Paiju (3,480m) at the base of Paiju Peak.' },
      { day: '7', title: 'Rest Day at Paiju', description: 'Acclimatization day. Short hike for glacier views.' },
      { day: '8', title: 'Paiju to Urdokas', description: 'Cross onto the Baltoro Glacier. Camp at Urdokas (4,050m) with Trango Towers views.' },
      { day: '9', title: 'Urdokas to Goro II', description: 'Trek through the glacier moraine. Camp at Goro II (4,450m).' },
      { day: '10', title: 'Goro II to Concordia', description: 'Arrive at Concordia (4,600m) — the junction of Baltoro and Godwin-Austen glaciers. K2 in full view.' },
      { day: '11', title: 'Concordia to K2 Base Camp', description: 'Trek to K2 Base Camp (5,150m). Stand at the foot of the world\'s most dangerous mountain.' },
      { day: '12', title: 'K2 BC to Concordia', description: 'Return to Concordia. Sunset views of Broad Peak, Gasherbrums, and K2.' },
      { day: '13', title: 'Rest / Weather Day', description: 'Buffer day for weather. Optional hike toward Broad Peak BC.' },
      { day: '14', title: 'Concordia to Gondogoro La BC', description: 'Trek to Ali Camp / Gondogoro La base camp (5,000m).' },
      { day: '15', title: 'Cross Gondogoro La', description: 'Early start (2 AM). Cross Gondogoro La pass (5,585m). Descend to Khuspang.' },
      { day: '16', title: 'Khuspang to Saicho', description: 'Descend through Hushe Valley. Camp at Saicho.' },
      { day: '17', title: 'Saicho to Hushe', description: 'Trek to Hushe village. Jeep pickup.' },
      { day: '18', title: 'Hushe to Skardu', description: 'Drive back to Skardu. Celebration dinner.' },
      { day: '19-21', title: 'Skardu to Islamabad', description: 'Fly or drive back to Islamabad. Buffer days for flight delays. Tour concludes.' }
    ],
    includes: ['All transport (flights Isb-Skardu-Isb, jeeps)', 'Accommodation (hotels in cities, tents on trek)', 'All meals during trek', 'Experienced high-altitude guide & porters', 'All camping & cooking equipment', 'Climbing gear for Gondogoro La (ropes, harness)', 'Permits (trekking, national park, Gondogoro)', 'First aid & emergency evacuation plan'],
    excludes: ['International flights to Pakistan', 'Personal trekking gear (boots, clothing, sleeping bag)', 'Travel & rescue insurance (mandatory)', 'Tips for porters & guides', 'Personal expenses', 'Visa fees']
  },
  {
    id: 3, name: 'Autumn Colors Tour', country: 'Pakistan', category: 'tour', featured: true,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    rating: 4.9, reviews: 280, price: 95000,
    description: 'An 11-day tour through Pakistan\'s most spectacular autumn landscapes. Fly into Skardu, drive through golden poplar-lined roads of Hunza, visit Khunjerab Pass, camp at Fairy Meadows under Nanga Parbat, and return via the scenic Naran-Kaghan valley.',
    highlights: ['Golden Autumn Colors', 'Skardu (flight)', 'Hunza Valley', 'Khunjerab Pass', 'Fairy Meadows', 'Naran & Lulusar Lake'],
    mapX: 725, mapY: 172, featured: true,
    duration: '11 Days / 10 Nights',
    priceUSD: '$680–750/person',
    groupSize: '6–15 people',
    bestSeason: 'Autumn (October–November)',
    difficulty: 'Easy',
    route: ['Islamabad', 'Skardu (flight)', 'Deosai', 'Hunza', 'Khunjerab Pass', 'Fairy Meadows', 'Naran', 'Islamabad'],
    itinerary: [
      { day: '1', title: 'Fly Islamabad to Skardu', description: 'Morning flight to Skardu. Afternoon visit to Shangrila Resort and Lower Kachura Lake.' },
      { day: '2', title: 'Skardu Exploration', description: 'Visit Skardu Fort, Upper Kachura Lake, and the Cold Desert.' },
      { day: '3', title: 'Skardu to Deosai to Hunza', description: 'Drive across Deosai Plateau (if open) or via Gilgit to Karimabad, Hunza.' },
      { day: '4', title: 'Hunza Valley', description: 'Eagle\'s Nest sunrise, Baltit Fort, Altit Fort. Walk through golden poplar avenues.' },
      { day: '5', title: 'Hunza to Khunjerab Pass', description: 'Full day excursion to Khunjerab Pass (4,693m). Return to Karimabad.' },
      { day: '6', title: 'Hunza to Passu & Attabad Lake', description: 'Visit Passu Cones, Hussaini Bridge, boat ride on turquoise Attabad Lake.' },
      { day: '7', title: 'Hunza to Fairy Meadows', description: 'Drive to Raikot Bridge, jeep to Tato, trek to Fairy Meadows.' },
      { day: '8', title: 'Fairy Meadows', description: 'Morning hike toward Nanga Parbat Base Camp. Photography and stargazing.' },
      { day: '9', title: 'Fairy Meadows to Naran', description: 'Trek down, drive via Babusar Pass (if open) to Naran.' },
      { day: '10', title: 'Naran & Lulusar Lake', description: 'Visit Lulusar Lake, Saif-ul-Malook Lake. Evening in Naran.' },
      { day: '11', title: 'Naran to Islamabad', description: 'Scenic drive back via Kaghan Valley. Tour concludes in Islamabad.' }
    ],
    includes: ['Flight Islamabad–Skardu', 'All ground transport (Coaster/Jeep)', 'Accommodation (hotels & guest houses)', 'All meals', 'Experienced tour guide', 'Permits & entry fees'],
    excludes: ['International flights', 'Personal expenses', 'Travel insurance', 'Tips & gratuities', 'Sleeping bag rental']
  },
  {
    id: 4, name: 'Summer Trekking & Tour', country: 'Pakistan', category: 'tour', featured: true,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    rating: 4.8, reviews: 160, price: 100000,
    description: 'A challenging 12-day summer adventure combining trekking at Nanga Parbat\'s Rupal Face with the cultural highlights of Hunza Valley. Visit the Hoper Glacier, cross Khunjerab Pass, and experience the best of Northern Pakistan in peak summer.',
    highlights: ['Nanga Parbat Rupal Face', 'Hoper Glacier', 'Khunjerab Pass', 'Hunza Valley', 'Karakoram Highway'],
    mapX: 688, mapY: 178, featured: true,
    duration: '12 Days / 11 Nights',
    priceUSD: '$700–800/person',
    groupSize: '4–12 people',
    bestSeason: 'Summer (June–August)',
    difficulty: 'Challenging',
    route: ['Islamabad', 'Chilas', 'Tarashing', 'Rupal Face BC', 'Hunza', 'Khunjerab Pass', 'Hoper', 'Gilgit', 'Islamabad'],
    itinerary: [
      { day: '1', title: 'Islamabad to Chilas', description: 'Drive via Karakoram Highway along the Indus River. Overnight in Chilas.' },
      { day: '2', title: 'Chilas to Tarashing', description: 'Drive to Tarashing village at the base of Nanga Parbat\'s Rupal Face.' },
      { day: '3', title: 'Tarashing to Rupal Face Base Camp', description: 'Trek to Rupal Face Base Camp. Dramatic close-up views of the 4,600m Rupal Face wall.' },
      { day: '4', title: 'Rupal Face Exploration', description: 'Day hike toward Shaigiri meadow. Photography and acclimatization.' },
      { day: '5', title: 'Rupal to Tarashing to Karimabad', description: 'Trek down and drive to Hunza. Evening in Karimabad.' },
      { day: '6', title: 'Hunza Valley', description: 'Explore Baltit Fort, Altit Fort, Eagle\'s Nest viewpoint, and local markets.' },
      { day: '7', title: 'Hunza to Khunjerab Pass', description: 'Full day excursion to the China border at 4,693m.' },
      { day: '8', title: 'Hunza to Passu & Attabad Lake', description: 'Passu Cones, Hussaini Bridge, Attabad Lake boating.' },
      { day: '9', title: 'Passu to Hoper Valley', description: 'Drive to Hoper. Hike to Hoper Glacier viewpoint.' },
      { day: '10', title: 'Hoper to Gilgit', description: 'Morning exploration of Hoper meadows. Drive to Gilgit city.' },
      { day: '11', title: 'Gilgit to Chilas', description: 'Drive along the Indus. Visit Kargah Buddha rock carving.' },
      { day: '12', title: 'Chilas to Islamabad', description: 'Final drive back to Islamabad. Tour concludes.' }
    ],
    includes: ['All ground transport (Coaster/Jeep)', 'Accommodation', 'All meals', 'Experienced trekking guide & porters', 'Camping equipment for trek', 'Permits & entry fees', 'First aid kit'],
    excludes: ['International/domestic flights', 'Personal trekking gear', 'Travel insurance', 'Tips & gratuities', 'Personal expenses']
  },
  {
    id: 5, name: 'October Explorer Tour', country: 'Pakistan', category: 'tour', featured: true,
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&q=80',
    rating: 4.8, reviews: 195, price: 90000,
    description: 'An 11-day October journey showcasing the best of Gilgit-Baltistan in peak autumn. Fly into Skardu, explore Khaplu and Shigar Fort, camp at Fairy Meadows, drive through the golden Hunza Valley, visit colorful Naltar Lakes, and return via scenic Naran-Kaghan.',
    highlights: ['Khaplu Palace & Shigar Fort', 'Fairy Meadows', 'Naltar Valley', 'Hunza Valley', 'Naran & Lake Saif-ul-Malook'],
    mapX: 714, mapY: 132, featured: true,
    duration: '11 Days / 10 Nights',
    priceUSD: '$650–780/person',
    groupSize: '6–15 people',
    bestSeason: 'October',
    difficulty: 'Easy',
    route: ['Islamabad', 'Skardu (flight)', 'Khaplu', 'Shigar', 'Fairy Meadows', 'Hunza', 'Naltar', 'Naran', 'Islamabad'],
    itinerary: [
      { day: '1', title: 'Fly Islamabad to Skardu', description: 'Morning flight. Afternoon explore Skardu bazaar and Kachura Lake.' },
      { day: '2', title: 'Skardu to Khaplu', description: 'Drive to Khaplu. Visit Chaqchan Mosque and Khaplu Palace.' },
      { day: '3', title: 'Khaplu to Skardu via Shigar', description: 'Return via Shigar Fort. Visit Cold Desert and Satpara Lake.' },
      { day: '4', title: 'Skardu to Gilgit', description: 'Scenic drive along the Indus River to Gilgit city.' },
      { day: '5', title: 'Gilgit to Fairy Meadows', description: 'Drive to Raikot Bridge, jeep to Tato, trek to Fairy Meadows.' },
      { day: '6', title: 'Fairy Meadows', description: 'Morning hike toward Nanga Parbat viewpoint. Full day in the meadows.' },
      { day: '7', title: 'Fairy Meadows to Karimabad', description: 'Trek down, drive to Hunza. Visit Baltit Fort at sunset.' },
      { day: '8', title: 'Hunza to Naltar Valley', description: 'Day trip to Naltar Valley. See the famous tri-colored lakes amid autumn foliage.' },
      { day: '9', title: 'Hunza to Naran', description: 'Drive via Babusar Pass (seasonal) or KKH to Naran.' },
      { day: '10', title: 'Naran & Lake Saif-ul-Malook', description: 'Jeep ride to Lake Saif-ul-Malook. Visit Lulusar Lake.' },
      { day: '11', title: 'Naran to Islamabad', description: 'Drive back via Kaghan Valley. Tour concludes in Islamabad.' }
    ],
    includes: ['Flight Islamabad–Skardu', 'All ground transport', 'Accommodation (hotels & guest houses)', 'All meals', 'Tour guide', 'Permits & entry fees'],
    excludes: ['International flights', 'Personal expenses', 'Travel insurance', 'Tips & gratuities', 'Sleeping bag rental']
  },

  // ── STANDALONE DESTINATIONS (3) ──
  {
    id: 6, name: 'Naltar Valley', country: 'Pakistan', category: 'valley',
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&q=80',
    rating: 4.8, reviews: 160, price: 40000,
    description: 'Famous for its tri-colored lakes that change hues with the seasons, Naltar Valley also hosts Pakistan\'s only ski resort. Pine forests, wildflowers, and crystal-clear streams await.',
    highlights: ['Naltar Lakes', 'Naltar Ski Resort', 'Pine Forest Walks', 'Wildflower Meadows', 'Drone Photography Spots'],
    mapX: 682, mapY: 152, featured: false
  },
  {
    id: 7, name: 'Deosai National Park', country: 'Pakistan', category: 'lake',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80',
    rating: 4.8, reviews: 135, price: 30000,
    description: 'The "Land of Giants" — one of the highest plateaus in the world at 4,114m. Home to the Himalayan brown bear, golden marmots, and endless fields of wildflowers in summer.',
    highlights: ['Sheosar Lake', 'Brown Bear Spotting', 'Wildflower Fields', 'Bara Pani', 'Night Sky Photography'],
    mapX: 722, mapY: 185, featured: false
  },
  {
    id: 8, name: 'Attabad Lake & Passu', country: 'Pakistan', category: 'lake',
    image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&q=80',
    rating: 4.7, reviews: 180, price: 38000,
    description: 'The stunning turquoise Attabad Lake, the iconic Passu Cones, and the thrilling Hussaini Suspension Bridge. A photographer\'s paradise along the Karakoram Highway.',
    highlights: ['Attabad Lake Boating', 'Passu Cones Viewpoint', 'Hussaini Suspension Bridge', 'Borith Lake', 'Passu Glacier'],
    mapX: 706, mapY: 142, featured: false
  }
];

const reviews = [
  {
    name: 'Ahmed Raza', location: 'Lahore, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    rating: 5, destination: 'Blossom Jeep Safari', verified: true,
    text: "The Blossom Jeep Safari was magical! Cherry blossoms everywhere, Fairy Meadows was breathtaking, and Khunjerab Pass blew our minds. Best 10 days of our lives. Highly recommended!"
  },
  {
    name: 'Sarah Thompson', location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    rating: 5, destination: 'Autumn Colors Tour', verified: true,
    text: 'The Autumn Colors Tour was beyond anything I imagined! Flying into Skardu, the golden poplars of Hunza, and Lake Saif-ul-Malook — all world-class. Worth every penny at $700.'
  },
  {
    name: 'Marco Rossi', location: 'Milan, Italy',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    rating: 5, destination: 'K2 Base Camp & Gondogoro La Trek', verified: true,
    text: 'The K2 Base Camp trek was the adventure of a lifetime! Standing at Concordia with four 8000m peaks around us, then crossing Gondogoro La — no words can describe it. Best trekking company in Pakistan!'
  },
  {
    name: 'Fatima Khan', location: 'Islamabad, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    rating: 5, destination: 'October Explorer Tour', verified: true,
    text: "Khaplu Palace, Fairy Meadows, Naltar Lakes, and the autumn colors of Hunza — this tour had everything! The guides were knowledgeable and every detail was perfectly planned."
  },
  {
    name: 'Aisha Malik', location: 'Karachi, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    rating: 5, destination: 'Summer Trekking & Tour', verified: true,
    text: "Trekking to Nanga Parbat's Rupal Face was incredible! The 4,600m wall towering above us, then driving through Hunza and crossing Khunjerab — a perfect summer adventure."
  },
  {
    name: 'David Chen', location: 'Toronto, Canada',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    rating: 5, destination: 'Naltar Valley', verified: true,
    text: 'The tri-colored lakes of Naltar were absolutely stunning! Every shade of blue and green you can imagine. The pine forests, fresh mountain air, and peaceful atmosphere — pure paradise!'
  }
];

const now = Date.now();
const deals = [
  {
    name: 'Blossom Jeep Safari — Early Bird', destination: 'Blossom Jeep Safari',
    image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80',
    oldPrice: 95000, newPrice: 85000, badge: 'Hot Deal',
    description: '10-day spring jeep safari — cherry blossoms, Fairy Meadows, Hunza, Khunjerab Pass. Book early and save $50/person!',
    expiresAt: new Date(now + 47 * 3600000)
  },
  {
    name: 'Autumn Colors Tour — Group Discount', destination: 'Autumn Colors Tour',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    oldPrice: 110000, newPrice: 95000, badge: 'Trending',
    description: '11-day autumn tour — Skardu flight, golden Hunza, Fairy Meadows, Naran. Group of 4+ saves 15%!',
    expiresAt: new Date(now + 23 * 3600000)
  },
  {
    name: 'October Explorer — Last Spots', destination: 'October Explorer Tour',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&q=80',
    oldPrice: 100000, newPrice: 90000, badge: 'Best Seller',
    description: '11-day October tour — Skardu, Khaplu, Fairy Meadows, Naltar, Naran. Limited spots remaining!',
    expiresAt: new Date(now + 71 * 3600000)
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
