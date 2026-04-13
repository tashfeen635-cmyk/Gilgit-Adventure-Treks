const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  destination: { type: String, required: true },
  region: String,
  checkIn: String,
  checkOut: String,
  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 },
  infants: { type: Number, default: 0 },
  totalPrice: Number,
  status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'cancelled', 'completed'] },
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

// Indexes for faster queries
bookingSchema.index({ createdAt: -1 }); // Sort by date (newest first)
bookingSchema.index({ status: 1 }); // Filter by status
bookingSchema.index({ customerEmail: 1 }); // Search by email

module.exports = mongoose.model('Booking', bookingSchema);
