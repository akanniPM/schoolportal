// utils/generateStudentId.js
// Centralized student ID generation
const Student = require('../models/Student');

const generateStudentId = async () => {
  const count = await Student.countDocuments();
  return 'STD' + (2025001 + count); // Increment-based (consistent)
};

// Alternative: Random-based (less predictable)
const generateStudentIdRandom = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `STD${randomNum}`;
};

module.exports = { generateStudentId, generateStudentIdRandom };
