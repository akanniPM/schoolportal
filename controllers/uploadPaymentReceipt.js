const Student = require('../models/Student');
const Payment = require('../models/Payment');
const { uploadToCloudinary } = require('../config/cloudinary');

// Upload payment receipt — streams buffer to Cloudinary, stores secure URL
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

    // Determine resource type for Cloudinary (PDF vs image)
    const resourceType = req.file.mimetype === 'application/pdf' ? 'raw' : 'image';

    const cloudinaryResult = await uploadToCloudinary(req.file.buffer, {
      resource_type: resourceType,
      public_id: `receipt_${studentId}_${Date.now()}`,
    });

    // Store Cloudinary secure URL instead of a local path
    student.receipt = {
      path: cloudinaryResult.secure_url,
      uploadedAt: new Date(),
      status: 'pending',
    };
    await student.save();

    res.status(201).json({
      message: 'Payment receipt uploaded successfully!',
      receipt: {
        url: cloudinaryResult.secure_url,
        uploadedAt: student.receipt.uploadedAt,
        status: 'pending',
      },
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