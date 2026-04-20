
const express = require('express');
const router = express.Router();
const Instructor = require('../models/Instructor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * /api/instructor-auth/login:
 *   post:
 *     summary: Login as an instructor
 *     tags: [Instructors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: inst_john
 *               password:
 *                 type: string
 *                 format: password
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
 *                 token:
 *                   type: string
 *                 instructor:
 *                   $ref: '#/components/schemas/Instructor'
 *       400:
 *         description: Username and password are required
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const instructor = await Instructor.findOne({ username });
    if (!instructor) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, instructor.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: instructor._id, instructorId: instructor.instructorId, email: instructor.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      instructor: {
        id: instructor._id,
        name: instructor.name,
        username: instructor.username,
        instructorId: instructor.instructorId,
        email: instructor.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
