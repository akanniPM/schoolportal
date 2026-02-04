require('dotenv').config();
const fs = require('fs');

const requiredVars = [
  'PORT',
  'MONGO_URI',
  'JWT_SECRET',
  'EMAIL_USER',
  'EMAIL_PASS',
];

const missing = requiredVars.filter((v) => !process.env[v]);
if (missing.length) {
  console.warn('⚠️  Missing required env vars:', missing.join(', '));
}

const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  cloudinary: {
    name: process.env.CLOUDNAME,
    apiKey: process.env.CLOUDKEY,
    apiSecret: process.env.CLOUDSECRET,
  },
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY,
  },
};

module.exports = config;
