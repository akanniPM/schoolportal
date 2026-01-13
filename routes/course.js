// routes/course.js
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const coursesController = require('../controllers/courseController');
// const authenticateAdmin = require('../middleware/authenticateInstructor');

// Get all courses
router.get('/', async (req, res) => {
  
  try {
    const courses = await Course.find(); // assumes `level` is a number in DB
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ message: 'Error fetching courses', error: err.message });
  }
});

// ✅ GET courses by level (e.g., /api/courses/1)
router.get('/:level', async (req, res) => {
  try {
    const level = parseInt(req.params.level, 10);
    const courses = await Course.find({ level });
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses by level:", err);
    res.status(500).json({ message: 'Server error fetching courses' });
  }
});

// Create new course
router.post('/', coursesController.createCourse);


// Update course
router.put('/:id', async (req, res) => {
  try {
    const { title, description, level } = req.body;
    const updated = await Course.findByIdAndUpdate(req.params.id, { title, description, level }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

module.exports = router;
