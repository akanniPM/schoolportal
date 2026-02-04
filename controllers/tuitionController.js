const Student = require('../models/Student');
const Payment = require('../models/Payment');

// Get tuition details and payment history for a student
const getTuitionDetails = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Find student by studentId (string) or _id (MongoDB ObjectId)
    const student = await Student.findOne({ 
      $or: [{ studentId }, { _id: studentId }] 
    }).select('-password');
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get payment history
    const payments = await Payment.find({ student: student._id }).sort({ createdAt: -1 });

    // Calculate balance (assuming tuition fee is a fixed amount; adjust as needed)
    const TUITION_FEE = 100000; // e.g., 100,000 in local currency per semester
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const balance = Math.max(0, TUITION_FEE - totalPaid);

    res.status(200).json({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      level: student.level,
      tuitionFee: TUITION_FEE,
      totalPaid,
      balance,
      payments,
    });
  } catch (err) {
    console.error('Error fetching tuition details:', err);
    res.status(500).json({ error: 'Error fetching tuition details' });
  }
};

// Get balance for current logged-in student
const getStudentBalance = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('balance');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ balance: student.balance || 0 });
  } catch (err) {
    console.error('Error fetching balance:', err);
    res.status(500).json({ error: 'Error fetching balance' });
  }
};

module.exports = { getTuitionDetails, getStudentBalance };