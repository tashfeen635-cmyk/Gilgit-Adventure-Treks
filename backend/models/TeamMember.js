const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, default: '' },
  image: { type: String, required: true },
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
