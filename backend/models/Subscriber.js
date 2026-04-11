const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Subscriber', subscriberSchema);
