const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  country: { type: String, required: true },
  category: { type: String, required: true, enum: ['valley', 'trek', 'lake', 'peak', 'heritage', 'tour'] },
  featured: { type: Boolean, default: false },
  image: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  highlights: [String],
  mapX: Number,
  mapY: Number,
  // Tour-specific fields (optional — only used when category is 'tour')
  duration: String,
  priceUSD: String,
  groupSize: String,
  bestSeason: String,
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Challenging', 'Extreme', null] },
  route: [String],
  itinerary: [{
    day: String,
    title: String,
    description: String
  }],
  includes: [String],
  excludes: [String]
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
