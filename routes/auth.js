const express = require("express");
const Student = require("../models/Student");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const Instructor = require("../models/Instructor");
const {authMiddleware} = require("../middleware/authMiddleware");

function generateStudentId() {
  return "STD" + Math.floor(100000 + Math.random() * 900000);
}

router.get("/student/me", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({ student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await Student.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const studentId = generateStudentId();
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      studentId,
    });

    // Send Email with student ID
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password if Gmail 2FA is on
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Student ID",
      text: `Hi ${name},\n\nWelcome! Your Student ID is: ${studentId}\nUse it to log in.\n\nRegards,\nStudent Portal Team`,
    };

    console.log("Sending email to:", email); // Debugging line

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      return res
        .status(500)
        .json({ message: "Error sending email", error: error.message });
    }

    res
      .status(201)
      .json({
        message: "Signup successful. Check your email for your student ID.",
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// ADMIN LOGIN
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// router.post('/login', async (req, res) => {
//   const { studentId, password } = req.body;

//   try {
//     const student = await Student.findOne({ studentId });
//     if (!student) return res.status(404).json({ message: 'Student not found' });

//     // Compare the given password with the stored hashed password
//     const isMatch = await bcrypt.compare(password, student.password);
//     if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

//     // Send success response with student data (excluding password)
//     res.status(200).json({
//       message: 'Login successful',
//       student: {
//         id: student._id,
//         name: student.name,
//         email: student.email,
//         studentId: student.studentId
//       }
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Login failed', error: err.message });
//   }
// });

// routes/auth.js
router.post("/student/login", async (req, res) => {
  const { studentId, password } = req.body;
  const student = await Student.findOne({ studentId });

  if (!student) return res.status(404).json({ error: "Student not found" });

  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid password" });

  return res.status(200).json({ message: "Login successful", student });
});

router.post("/instructor-login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const instructor = await Instructor.findOne({ username });

    if (!instructor || instructor.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: instructor._id, role: "instructor" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, instructor });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
