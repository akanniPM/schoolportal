const Student = require('../models/Student');
const Payment = require('../models/Payment');

// Upload payment receipt (already uploaded via Multer in route)
// This controller handles the receipt upload and validation
const uploadPaymentReceipt = async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Store receipt as object with file path, upload timestamp, and status
    student.receipt = {
      path: req.file.path,
      uploadedAt: new Date(),
      status: 'pending'
    };
    await student.save();

    res.status(201).json({
      message: 'Payment receipt uploaded successfully!',
      receipt: {
        path: req.file.path,
        fileName: req.file.filename,
        uploadedAt: student.receipt.uploadedAt,
        status: 'pending'
      }
    });
  } catch (err) {
    console.error('Error uploading payment receipt:', err);
    res.status(500).json({ error: 'Error uploading payment receipt', details: err.message });
  }
};

// Get receipt status
const getReceiptStatus = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findOne({ studentId }).select('receipt receiptVerified');
    if (!student || !student.receipt) {
      return res.status(404).json({ error: 'No receipt found for this student' });
    }

    res.status(200).json({
      studentId,
      receipt: {
        path: student.receipt.path,
        uploadedAt: student.receipt.uploadedAt,
        status: student.receipt.status
      },
      receiptVerified: student.receiptVerified
    });
  } catch (err) {
    console.error('Error fetching receipt status:', err);
    res.status(500).json({ error: 'Error fetching receipt status' });
  }
};

module.exports = { uploadPaymentReceipt, getReceiptStatus };