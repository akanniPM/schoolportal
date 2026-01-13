// utils/randomGenerator.js

const generateUsername = (role= 'student') => {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  const prefix = role === 'instructor' ? 'instruct' : 'student';
  return `${prefix}${suffix}`;
};

const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

module.exports = {
  generateUsername,
  generatePassword,
};
