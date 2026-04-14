const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  avatar: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  destination: { type: String, required: true },
  verified: { type: Boolean, default: false },
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, default: 'approved', enum: ['pending', 'approved', 'rejected'] }
}, { timestamps: true });

// Indexes for faster queries
reviewSchema.index({ createdAt: -1 }); // Sort by date
reviewSchema.index({ status: 1 }); // Filter by status
reviewSchema.index({ rating: -1 }); // Sort by rating

module.exports = mongoose.model('Review', reviewSchema);
