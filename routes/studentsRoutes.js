const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

const { authMiddleware } = require("../middleware/authMiddleware");
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
router.post("/register", registerStudent);

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

// 📤 UPLOAD RECEIPT
router.post("/upload-receipt", upload.single("receipt"), async (req, res) => {
  try {
    const { studentId } = req.body;
    const filePath = req.file.path;

    if (!studentId || !filePath) {
      return res.status(400).json({ error: "Missing student ID or file" });
    }

    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ error: "Student not found" });

    student.receipt = filePath;
    await student.save();

    res.status(200).json({
      message: "Receipt uploaded successfully",
      path: filePath,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
