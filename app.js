const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course');
const payment = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/admin');
const instructorAuthRoutes = require('./routes/instructorAuth')
const instructorAdminRoutes = require('./routes/instructorAdmin');
const studentRoutes = require('./routes/studentsRoutes'); 


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);  // Corrected
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/payments', payment);
app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/instructor-auth', instructorAuthRoutes);
app.use('/api/instructor-admin', instructorAdminRoutes);




// Log all registered routes for debugging
if (app._router && app._router.stack) {
  app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      console.log(r.route.path);
    }
  });
}

module.exports = app;
// This is the main entry point for the application. It sets up the Express server, middleware, and routes.
// The server listens on port 5000 and uses CORS and JSON parsing middleware. It also imports and uses various route modules for authentication, courses, students, payments, and admin functionalities. The registered routes are logged for debugging purposes.