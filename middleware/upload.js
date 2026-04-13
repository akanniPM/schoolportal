// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Use memory storage — file is kept as a buffer and streamed to Cloudinary
const storage = multer.memoryStorage();

// File filter — validate both extension AND MIME type
const fileFilter = (req, file, cb) => {
  const allowedExts = /\.(jpeg|jpg|png|pdf)$/i;
  const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
  const extValid = allowedExts.test(path.extname(file.originalname));
  const mimeValid = allowedMimes.includes(file.mimetype);
  if (extValid && mimeValid) cb(null, true);
  else cb(new Error('Only JPEG, PNG, and PDF files are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max

module.exports = upload;
