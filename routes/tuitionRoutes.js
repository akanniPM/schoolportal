// routes/tuitionRoutes.js
const express = require('express');
const router = express.Router();
const { getTuitionDetails, getStudentBalance } = require('../controllers/tuitionController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Get tuition details for a student
router.get('/:studentId', getTuitionDetails);

// Get current student's balance (protected)
router.get('/balance/current', authMiddleware, getStudentBalance);

module.exports = router;
