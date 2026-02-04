require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";



mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ MongoDB connected');

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch(err => console.error('❌ MongoDB connection error:', err));
