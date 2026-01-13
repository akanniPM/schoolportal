const Instructor = require('../models/Instructor');
const bcrypt = require('bcryptjs');
const isGmail = require('../utils/validateEmail'); // Utility to check if email is a Gmail address
const Student = require('../models/studentModel');


const signupInstructor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Validate Gmail address
    if (!isGmail(email)) {
      return res.status(400).json({ error: 'Only @gmail.com addresses are allowed.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const instructor = await Instructor.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Instructor registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const gradeStudent = async (req, res) => {
  const { studentId, courseId } = req.params;
  const { grade } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Check if grade for this course already exists
    const existingGradeIndex = student.grades.findIndex(g => g.course.toString() === courseId);

    if (existingGradeIndex !== -1) {
      // Update existing grade
      student.grades[existingGradeIndex].grade = grade;
    } else {
      // Add new grade
      student.grades.push({ course: courseId, grade });
    }

    await student.save();

    res.status(200).json({ message: 'Grade submitted successfully' });
  } catch (err) {
    console.error('Error grading student:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { signupInstructor, gradeStudent };
