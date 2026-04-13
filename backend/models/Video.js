const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  tag: { type: String, default: 'Cinematic' },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, default: '' }, // Thumbnail image for faster loading
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
