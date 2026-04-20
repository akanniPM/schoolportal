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

/**
 * @swagger
 * /api/students/register:
 *   post:
 *     summary: Register a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, level]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: jane@gmail.com
 *               password:
 *                 type: string
 *                 example: Secret123
 *               level:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registration successful
 *                 studentId:
 *                   type: string
 *                   example: STD123456
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Email already registered or validation failed
 *       500:
 *         description: Server error
 */
router.post("/register", validateStudentSignup, registerStudent);

/**
 * @swagger
 * /api/students/login:
 *   post:
 *     summary: Login a student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [studentId, password]
 *             properties:
 *               studentId:
 *                 type: string
 *                 example: STD123456
 *               password:
 *                 type: string
 *                 example: Secret123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.post("/login", loginStudent);

/**
 * @swagger
 * /api/students/profile:
 *   get:
 *     summary: Get student profile
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Student profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 studentId:
 *                   type: string
 *                   example: STD123456
 *                 level:
 *                   type: integer
 *                   example: 1
 *                 balance:
 *                   type: number
 *                 registeredCourses:
 *                   type: array
 *                   items:
 *                     type: string
 *                 receipt:
 *                   type: object
 *                   properties:
 *                     path:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [pending, approved, rejected]
 *       401:
 *         description: Unauthorized or invalid token
 *       404:
 *         description: Student not found
 */
router.get("/profile", authMiddleware, getStudentProfile);

/**
 * @swagger
 * /api/students/{id}/register-courses:
 *   post:
 *     summary: Register courses for a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Courses registered successfully
 *       404:
 *         description: Student not found
 */
router.post("/:id/register-courses", registerCourses);

/**
 * @swagger
 * /api/students/registered-courses:
 *   get:
 *     summary: Get student's registered courses
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Registered courses retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   code:
 *                     type: string
 *                   description:
 *                     type: string
 *                   level:
 *                     type: integer
 *                   credits:
 *                     type: number
 *       401:
 *         description: Unauthorized
 */
router.get("/registered-courses", authMiddleware, getRegisteredCourses);

/**
 * @swagger
 * /api/students/verify-payment:
 *   post:
 *     summary: Verify Paystack payment
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reference, amountPaid]
 *             properties:
 *               reference:
 *                 type: string
 *                 example: "paystack_ref_123"
 *               amountPaid:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Payment verification failed
 */
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

/**
 * @swagger
 * /api/students/upload-receipt:
 *   post:
 *     summary: Upload a payment receipt
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [studentId, receipt]
 *             properties:
 *               studentId:
 *                 type: string
 *                 example: STD123456
 *               receipt:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Receipt uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 path:
 *                   type: string
 *       400:
 *         description: Missing student ID or file
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
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
