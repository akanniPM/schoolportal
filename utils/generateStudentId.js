// utils/generateStudentId.js
// Centralized student ID generation
const Student = require('../models/Student');

const generateStudentId = async () => {
  let studentId;
  let exists = true;
  while (exists) {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    studentId = `STD${randomNum}`;
    exists = await Student.exists({ studentId });
  }
  return studentId;
};

module.exports = { generateStudentId };
