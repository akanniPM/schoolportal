const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  username: { type: String, sparse: true, unique: true },
  password: { type: String, required: false },
  studentId: { type: String, required: true, unique: true },
  level: { type: Number, required: true },
  grades: [{ course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, grade: String }], // Track grades per course
  balance: { type: Number, default: 0 }, // Track student balance for payments
  registeredCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Track registered courses
  receipt: {
    path: { type: String, required: false },
    uploadedAt: { type: Date, default: null },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  }, // Unified receipt object
  receiptVerified: { type: Boolean, default: false }, // Track if receipt is verified
});

const student = mongoose.model("Student", studentSchema);

module.exports = student;



// Hi Eniola,

// Welcome! Your Student ID is: STD334147
// Use it to log in.

// Regards,
// Student Portal Team
