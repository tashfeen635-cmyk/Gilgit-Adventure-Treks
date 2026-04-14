const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
  userType: { type: String, required: true, enum: ['admin', 'user'] },
  username: { type: String, required: true },
  email: String,
  ip: String,
  userAgent: String,
  success: { type: Boolean, default: true },
  failReason: String
}, { timestamps: true });

// Auto-delete logs older than 90 days
loginLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 3600 });

module.exports = mongoose.model('LoginLog', loginLogSchema);
