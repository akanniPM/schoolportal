// routes/instructorAdmin.js
const express = require('express');
const router = express.Router();
const Instructor = require('../models/Instructor');
const Course = require('../models/Course');
const Student = require('../models/Student');
const { authMiddleware } = require('../middleware/authMiddleware');

// Middleware to verify instructor token
const verifyInstructor = (req, res, next) => {
  if (!req.user || req.user.role !== 'instructor') {
    return res.status(403).json({ error: 'Access denied. Instructors only.' });
  }
  next();
};

// Get all instructors (admin only - no auth for now, can be added later)
router.get('/', async (req, res) => {
  try {
    const instructors = await Instructor.find().select('-password').populate('assignedCourses');
    res.json(instructors);
  } catch (err) {
    console.error('Error fetching instructors:', err);
    res.status(500).json({ error: 'Failed to fetch instructors' });
  }
});

// Get instructor profile (authenticated)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.user.id)
      .select('-password')
      .populate('assignedCourses');
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });
    res.json(instructor);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Edit instructor profile (authenticated)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Only allow editing own profile unless admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Cannot edit other instructor profiles' });
    }

    const { name, email } = req.body;
    const updated = await Instructor.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    ).select('-password');

    res.json({ message: 'Instructor updated successfully', instructor: updated });
  } catch (err) {
    console.error('Error updating instructor:', err);
    res.status(500).json({ error: 'Failed to update instructor' });
  }
});

// Get assigned courses for an instructor
router.get('/:id/courses', async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id).populate('assignedCourses');
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });

    res.json({ instructorId: instructor.instructorId, courses: instructor.assignedCourses });
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get students enrolled in instructor's courses
router.get('/:id/students', authMiddleware, async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id).populate('assignedCourses');
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });

    // Find all students enrolled in instructor's courses
    const students = await Student.find({
      registeredCourses: { $in: instructor.assignedCourses }
    }).select('name email studentId level registeredCourses grades');

    res.json({ students });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Submit/Update grade for a student
router.post('/:instructorId/grade/:studentId/:courseId', authMiddleware, async (req, res) => {
  try {
    const { grade } = req.body;

    if (!grade) {
      return res.status(400).json({ error: 'Grade is required' });
    }

    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    // Check if grade for this course exists
    const gradeIndex = student.grades.findIndex(
      g => g.course.toString() === req.params.courseId
    );

    if (gradeIndex !== -1) {
      // Update existing grade
      student.grades[gradeIndex].grade = grade;
    } else {
      // Add new grade
      student.grades.push({ course: req.params.courseId, grade });
    }

    await student.save();

    res.status(200).json({
      message: 'Grade submitted successfully',
      grade: { course: req.params.courseId, grade }
    });
  } catch (err) {
    console.error('Error submitting grade:', err);
    res.status(500).json({ error: 'Failed to submit grade' });
  }
});

// Get students' grades for a course
router.get('/:instructorId/course/:courseId/grades', authMiddleware, async (req, res) => {
  try {
    const students = await Student.find({
      'grades.course': req.params.courseId
    }).select('name studentId grades');

    const courseGrades = students.map(student => ({
      studentId: student.studentId,
      name: student.name,
      grade: student.grades.find(g => g.course.toString() === req.params.courseId)?.grade
    }));

    res.json(courseGrades);
  } catch (err) {
    console.error('Error fetching grades:', err);
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
});

// Delete instructor
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Only allow deletion by admin or self
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Cannot delete other instructor accounts' });
    }

    const deleted = await Instructor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Instructor not found' });

    res.json({ message: 'Instructor deleted successfully' });
  } catch (err) {
    console.error('Error deleting instructor:', err);
    res.status(500).json({ error: 'Failed to delete instructor' });
  }
});

module.exports = router;
