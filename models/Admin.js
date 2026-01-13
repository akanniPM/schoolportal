// models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String // In production, this should be hashed!
});

module.exports = mongoose.model('Admin', adminSchema);
