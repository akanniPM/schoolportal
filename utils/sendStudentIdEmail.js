const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async function sendStudentIdEmail(email, studentId) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Student ID for Portal Login',
    text: `Welcome! Your Student ID is: ${studentId}`,
  };

  await transporter.sendMail(mailOptions);
};
