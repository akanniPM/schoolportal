const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  username: { type: String, sparse: true, unique: true },
  password: { type: String, required: false },
  studentId: { type: String, required: true, unique: true },
  level: { type: Number, required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Track registered courses
  grade: {String}, // Track overall grade
  registeredCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Track registered courses
  receipt: { type: String, required: false }, // Receipt for payment
  receiptStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending'},
  receiptVerified: { type: Boolean, default: false }, // Track if receipt is verified
});

module.exports = mongoose.model('Student', studentSchema);



// Hi Eniola,

// Welcome! Your Student ID is: STD334147
// Use it to log in.

// Regards,
// Student Portal Team
