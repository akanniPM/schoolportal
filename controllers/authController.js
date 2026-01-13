const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const sendStudentIdEmail = require('../utils/sendStudentIdEmail');

const generateStudentId = async () => {
  const count = await Student.countDocuments();
  return 'STD' + (2025001 + count); // simple increment
};

const signup = async (req, res) => {
  try {
    const { name, email, password, course } = req.body;
    

    // Check if the email already exists
    if (!/^[^@]+@gmail\.com$/i.test(email))  {
      return res.status(400).json({ error: 'Invalid email format. Please use a Gmail address.' });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ erro: 'Email already exists' });
    }
    const existingId = await Student.findOne({ studentId });
    if (existingId) {
      return res.statu(400).json({error: 'Student Id already exists'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const studentId = await generateStudentId();

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      course,
      studentId,
    });

    await sendStudentIdEmail(email, studentId);

    res.status(201).json({ message: 'Signup successful! Check your email for Student ID.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { studentId, password } = req.body;
    console.log(req.body); // Debugging line to check incoming data
    
    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      // Set the JWT token in an HTTP-only cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  // only for production if using HTTPS
        maxAge: 24 * 60 * 60 * 1000,  // 1 day
      });
  
      // Return student ID and other relevant data in the response if needed
      res.status(200).json({
        message: 'Login successful',
        studentId: student.studentId,  // You can include this if needed
        student: student,              // If you want to send other student data
      });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {generateStudentId, signup, login};
