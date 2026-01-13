// routes/instructorAuth.js
const express = require('express');
const router = express.Router();
const Instructor = require('../models/Instructor');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const instructor = await Instructor.findOne({ username, password });
  if (!instructor) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Optionally generate a token here
  res.status(200).json({
    message: 'Login successful',
    instructor: {
      id: instructor._id,
      name: instructor.name,
      username: instructor.username,
    },
  });
});

module.exports = router;
