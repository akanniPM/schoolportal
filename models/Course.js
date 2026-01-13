// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: String,
  level: { type: Number, required: true }, // e.g. 1, 2, 3
  // instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' },
});

module.exports = mongoose.model('Course', courseSchema);
