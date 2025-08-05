const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  originalUrl: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date } 
});
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Url', urlSchema);