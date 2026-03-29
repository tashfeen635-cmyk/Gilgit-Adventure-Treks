const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  country: { type: String, required: true },
  category: { type: String, required: true, enum: ['valley', 'trek', 'lake', 'peak', 'heritage'] },
  featured: { type: Boolean, default: false },
  image: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  highlights: [String],
  mapX: Number,
  mapY: Number
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
