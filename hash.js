const bcrypt = require("bcryptjs");

const run = async () => {
  const password = "xyoomjpp";
  const hashed = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hashed);
};

run();
