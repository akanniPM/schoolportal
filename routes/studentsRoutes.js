const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

const { authMiddleware } = require("../middleware/authMiddleware");
const { validateStudentSignup } = require("../middleware/validateInput");
const upload = require("../middleware/upload");
const Student = require("../models/Student");
const Course = require("../models/Course");
const {
  registerStudent,
  loginStudent,
  getStudentProfile,
  registerCourses,
  getRegisteredCourses,
} = require("../controllers/studentController");
const { verifyPayment } = require("../controllers/paymentController");

// 🧾 REGISTER NEW STUDENT (SIGNUP)
router.post("/register", validateStudentSignup, registerStudent);

// 🔑 LOGIN
router.post("/login", loginStudent);

// 👤 FETCH PROFILE (protected)
router.get("/profile", authMiddleware, getStudentProfile);

// 🎓 REGISTER COURSES
router.post("/:id/register-courses", registerCourses);

// 📚 GET REGISTERED COURSES
router.get("/registered-courses", authMiddleware, getRegisteredCourses);

// 💳 VERIFY PAYMENT (Paystack)
router.post("/verify-payment", verifyPayment);

// 📤 UPLOAD RECEIPT (saves to Cloudinary when configured, otherwise keeps local path)
const config = require('../config');
let cloudinary;
if (config.cloudinary && config.cloudinary.name) {
  cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: config.cloudinary.name,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
}

router.post('/upload-receipt', upload.single('receipt'), async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId || !req.file) {
      return res.status(400).json({ error: 'Missing student ID or file' });
    }

    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    let storedPath = req.file.path; // default to local

    // If Cloudinary is configured, upload and replace path
    if (cloudinary) {
      try {
        const uploadRes = await cloudinary.uploader.upload(req.file.path, { folder: 'receipts' });
        storedPath = uploadRes.secure_url || uploadRes.url;
        // try to remove local file
        const fs = require('fs');
        fs.unlink(req.file.path, (err) => { if (err) console.warn('Could not delete local file', err.message); });
      } catch (cloudErr) {
        console.error('Cloudinary upload failed:', cloudErr.message);
        // fall back to local path
      }
    }

    student.receipt = {
      path: storedPath,
      uploadedAt: new Date(),
      status: 'pending',
    };
    await student.save();

    res.status(200).json({ message: 'Receipt uploaded successfully', path: storedPath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
