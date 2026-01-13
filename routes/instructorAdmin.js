// routes/instructorAdmin.js
const express = require('express');
const router = express.Router();
const Instructor = require('../models/Instructor');

// Get all instructors
router.get('/', async (req, res) => {
  try {
    const instructors = await Instructor.find();
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch instructors' });
  }
});

// Edit instructor
router.put('/:id', async (req, res) => {
  try {
    const updated = await Instructor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update instructor' });
  }
});

// Username: student4098
// Password: 3043z0hq
// Delete instructor
router.delete('/:id', async (req, res) => {
  try {
    await Instructor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Instructor deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete instructor' });
  }
});

module.exports = router;
