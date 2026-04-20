const express = require("express");
const Student = require("../models/Student");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const Instructor = require("../models/Instructor");
const {authMiddleware} = require("../middleware/authMiddleware");
const { generateStudentId } = require("../utils/generateStudentId");

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
  const { name, email, password, level } = req.body;

  try {
    const existing = await Student.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const studentId = await generateStudentId();
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      studentId,
      level: level || 1,
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
      ;
    } catch (error) {
      console.error("Error sending email:", error);
      await Student.findByIdAndDelete(student._id);
      return res
        .status(500)
        .json({ message: "Error sending email. Registration rolled back.", error: error.message });
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
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
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

router.post("/student/login", async (req, res) => {
  try {
    const { studentId, password } = req.body;
    const student = await Student.findOne({ studentId });

    if (!student) return res.status(404).json({ error: "Student not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const { password: _pw, ...studentData } = student.toObject();
    return res.status(200).json({ message: "Login successful", student: studentData });
  } catch (err) {
    console.error("Student login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/instructor-login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const instructor = await Instructor.findOne({ username });

    if (!instructor) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, instructor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: instructor._id, role: "instructor" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: _pw, ...instructorData } = instructor.toObject();
    res.json({ token, instructor: instructorData });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
