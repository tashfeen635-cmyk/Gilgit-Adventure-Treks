const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  altText: { type: String, default: '' },
  hidden: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
