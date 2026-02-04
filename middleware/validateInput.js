// middleware/validateInput.js
// Input validation middleware for common scenarios

const validateStudentSignup = (req, res, next) => {
  const { name, email, password, level } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
  }

  if (!email || !/^[^@]+@gmail\.com$/i.test(email)) {
    return res.status(400).json({ error: 'Valid Gmail address is required' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (level !== undefined && (!Number.isInteger(level) || level < 1 || level > 4)) {
    return res.status(400).json({ error: 'Level must be an integer between 1 and 4' });
  }

  next();
};

const validateInstructorSignup = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
  }

  if (!email || !/^[^@]+@gmail\.com$/i.test(email)) {
    return res.status(400).json({ error: 'Valid Gmail address is required' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  next();
};

const validatePaymentInput = (req, res, next) => {
  const { email, amount } = req.body;

  if (!email || !/^[^@]+@gmail\.com$/i.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!amount || !Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }

  if (amount > 1000000) {
    return res.status(400).json({ error: 'Amount exceeds maximum limit' });
  }

  next();
};

const validateCourseInput = (req, res, next) => {
  const { title, code, description, level } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Course title is required' });
  }

  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    return res.status(400).json({ error: 'Course code is required' });
  }

  if (level !== undefined && (!Number.isInteger(level) || level < 1 || level > 4)) {
    return res.status(400).json({ error: 'Course level must be an integer between 1 and 4' });
  }

  next();
};

const validateGradeInput = (req, res, next) => {
  const { grade } = req.body;

  if (!grade || typeof grade !== 'string') {
    return res.status(400).json({ error: 'Grade is required and must be a string' });
  }

  // Valid grades: A, B, C, D, E, F
  if (!/^[A-F]$/.test(grade.toUpperCase())) {
    return res.status(400).json({ error: 'Grade must be A, B, C, D, E, or F' });
  }

  next();
};

module.exports = {
  validateStudentSignup,
  validateInstructorSignup,
  validatePaymentInput,
  validateCourseInput,
  validateGradeInput
};
