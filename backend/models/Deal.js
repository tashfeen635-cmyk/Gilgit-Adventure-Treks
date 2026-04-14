const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  destination: { type: String, required: true },
  image: { type: String, required: true },
  oldPrice: { type: Number, required: true },
  newPrice: { type: Number, required: true },
  badge: { type: String, required: true },
  description: { type: String, required: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

// Indexes for faster queries
dealSchema.index({ createdAt: -1 }); // Sort by date
dealSchema.index({ expiresAt: 1 }); // Filter by expiration

module.exports = mongoose.model('Deal', dealSchema);
