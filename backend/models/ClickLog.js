// models/ClickLog.js
const mongoose = require('mongoose');

const ClickLogSchema = new mongoose.Schema({
  slug: String,
  timestamp: { type: Date, default: Date.now },
  ip: String, // optional
  userAgent: String, // optional
});

module.exports = mongoose.model('ClickLog', ClickLogSchema);