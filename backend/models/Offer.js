const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  discount: { type: String, required: true },
  validUntil: { type: Date, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  conditions: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Offer', offerSchema);