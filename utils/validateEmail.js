// utils/validateEmail.js
const isGmail = (email) => {
  return /^[^@]+@gmail\.com$/i.test(email);
};

module.exports = isGmail;
