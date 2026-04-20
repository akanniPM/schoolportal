// routes/course.js
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const coursesController = require('../controllers/courseController');
const { validateCourseInput } = require('../middleware/validateInput');

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of all courses
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
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  
  try {
    const courses = await Course.find(); // assumes `level` is a number in DB
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ message: 'Error fetching courses', error: err.message });
  }
});

/**
 * @swagger
 * /api/courses/{level}:
 *   get:
 *     summary: Get courses by level
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: level
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 4
 *         example: 1
 *     responses:
 *       200:
 *         description: Courses for the specified level
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
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, code, level]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction to Computer Science
 *               code:
 *                 type: string
 *                 example: CS101
 *               description:
 *                 type: string
 *               level:
 *                 type: integer
 *                 example: 1
 *               credits:
 *                 type: number
 *                 example: 3
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 code:
 *                   type: string
 *                 description:
 *                   type: string
 *                 level:
 *                   type: integer
 *                 credits:
 *                   type: number
 *       400:
 *         description: Validation error or course code already exists
 *       500:
 *         description: Server error
 */
router.post('/', validateCourseInput, coursesController.createCourse);


/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
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
 *             required: [title, code, level]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction to Computer Science
 *               code:
 *                 type: string
 *                 example: CS101
 *               description:
 *                 type: string
 *               level:
 *                 type: integer
 *                 example: 1
 *               credits:
 *                 type: number
 *                 example: 3
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 code:
 *                   type: string
 *                 description:
 *                   type: string
 *                 level:
 *                   type: integer
 *                 credits:
 *                   type: number
 *       500:
 *         description: Server error
 */
router.put('/:id', validateCourseInput, async (req, res) => {
  try {
    const { title, description, level } = req.body;
    const updated = await Course.findByIdAndUpdate(req.params.id, { title, description, level }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

module.exports = router;
