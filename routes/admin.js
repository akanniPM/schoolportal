const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const Course = require('../models/Course');
const generateRandom = require('../utils/randomGenerator')
const generateRandomPassword = require('../utils/randomGenerator'); // Adjust path if needed
// const password = generateRandomPassword()
const Instructor = require('../models/Instructor');
const { generateUsername, generatePassword } = require('../utils/randomGenerator');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// GET all tuition payments
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// PATCH: update payment status
router.patch('/payments/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const updated = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Payment not found' });

    res.json({ message: 'Payment status updated', payment: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});


router.get('/tuition-payments', verifyToken, isAdmin, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tuition payments' });
  }
});

router.post('/pay-tuition', verifyToken, async (req, res) => {
  try {
    // Your code to handle the tuition payment submission
    res.status(200).json({ message: 'Tuition payment submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit payment' });
  }
});

// Get all pending receipts
router.get('/receipts', async (req, res) => {
  try {
    const receipts = await Student.find({ 'receipt.path': { $exists: true } });
    res.status(200).json(receipts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve or reject a receipt
router.post('/verify-receipt', async (req, res) => {
  try {
    const { studentId, status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const student = await Student.findOne({ studentId });
    if (!student || !student.receipt.path) {
      return res.status(404).json({ error: 'Receipt not found' });
    }

    student.receipt.status = status;
    await student.save();

    res.status(200).json({ message: `Receipt ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Generate unique credentials for a student
// router.post('/students/:id/generate-credentials', async (req, res) => {
//   try {
//     const student = await Student.findById(req.params.id);
//     if (!student) return res.status(404).json({ error: 'Student not found' });

//     if (student.username) {
//       return res.status(400).json({ error: 'Credentials already generated' });
//     }

//     const username = generateUsername();
//     const rawPassword = generatePassword();
//     const hashedPassword = await bcrypt.hash(rawPassword, 10);

//     student.username = username;
//     student.password = hashedPassword;
//     await student.save();

//     res.json({ username, password });
//   } catch (err) {
//     console.error(err);  // <-- You should see exact error in terminal
//     res.status(500).json({ error: 'Failed to generate credentials' });
//   }
// });
router.post('/students/:id/generate-credentials', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const username = generateUsername();
    const rawPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    student.username = username;
    student.password = hashedPassword;

    await student.save();

    console.log("Generated login:", {
      username,
      rawPassword,
      hashedPassword
    });

    res.json({ username, rawPassword }); // Send rawPassword to frontend/admin
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate credentials' });
  }
});



// POST /api/admin/generate-user
// admin.j
router.post('/generate-user', async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: 'Name, email, and role are required' });
  }

  try {
    const username = generateUsername(role);  // ✅ Pass role
    const rawPassword = generatePassword();    // 👈 Generate raw
    const hashedPassword = await bcrypt.hash(rawPassword, 10); // 👈 Hash it

    let user;

    if (role === 'student') {
      user = new Student({
        name,
        email,
        studentId: username,
        username,
        password: hashedPassword, // ✅ Store hashed
        level: 1,
        courses: [],
      });
    } else if (role === 'instructor') {
      user = new Instructor({
        name,
        email,
        instructorId: username,
        username,
        password: hashedPassword, // ✅ Store hashed
        assignedCourses: [],
      });
    } else {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      username,
      password: rawPassword, // ✅ Return raw password only in response
      role,
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
});




// router.post('/generate-user', async (req, res) => {
//   try {
//     const studentID = generateUsername('student');
//     const rawPassword = generatePassword();

//     // 🔐 Hash the password
//     const hashedPassword = await bcrypt.hash(rawPassword, 10);

//     const newStudent = new Student({
//       name: req.body.name,
//       email: req.body.email,
//       studentId: studentID,
//       username: studentID,
//       password: hashedPassword,
//       // level: req.body.level,
//     });

//     await newStudent.save();

//     res.status(201).json({
//       message: 'Student created',
//       studentID,
//       rawPassword // ⚠️ Only send this once — never store it in plain text
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });



// GET all instructors
router.get('/instructors', async (req, res) => {
  try {
    const instructors = await Instructor.find().sort({ createdAt: -1 });
    res.json(instructors);
  } catch (err) {
    console.error('Error fetching instructors:', err);
    res.status(500).json({ error: 'Failed to fetch instructors' });
  }
});

// PUT /api/admin/instructors/:id
router.put('/instructors/:id', async (req, res) => {
  try {
    const { name, email } = req.body;

    const updated = await Instructor.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Instructor not found' });

    res.json({ message: 'Instructor updated successfully', instructor: updated });
  } catch (err) {
    console.error('Error updating instructor:', err);
    res.status(500).json({ error: 'Failed to update instructor' });
  }
});

// DELETE /api/admin/instructors/:id
router.delete('/instructors/:id', async (req, res) => {
  try {
    const deleted = await Instructor.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ error: 'Instructor not found' });

    res.json({ message: 'Instructor deleted successfully' });
  } catch (err) {
    console.error('Error deleting instructor:', err);
    res.status(500).json({ error: 'Failed to delete instructor' });
  }
});

// GET all students
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Inside routes/admin.js

// Assign courses to instructor
router.put('/instructors/:id/assign-courses', async (req, res) => {
  const { courseIds } = req.body;

  if (!Array.isArray(courseIds)) {
    return res.status(400).json({ message: 'courseIds must be an array' });
  }

  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    instructor.assignedCourses = courseIds;
    await instructor.save();

    res.json({ message: 'Courses assigned successfully', instructor });
  } catch (err) {
    console.error('Error assigning courses:', err);
    res.status(500).json({ message: 'Server error assigning courses' });
  }
});

// DELETE /api/admin/students/:id/credentials
router.delete('/students/:id/credentials', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    student.username = undefined;
    student.password = undefined; // or null
    await student.save();

    res.json({ message: 'Credentials deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});










module.exports = router;
