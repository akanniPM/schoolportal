require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB (non-blocking)
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ MongoDB connected');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.warn('⚠️  Server starting without database connection. API endpoints may fail.');
});

// Start server regardless of DB connection
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
});
