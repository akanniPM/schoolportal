const Student = require("../models/Student");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateStudentId } = require("../utils/generateStudentId");

// 🔐 Generate JWT token
const generateToken = (student) => {
  return jwt.sign(
    { id: student._id, email: student.email, studentId: student.studentId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 🧾 REGISTER / SIGNUP
const registerStudent = async (req, res) => {
  try {
    const { name, email, level, password } = req.body;

    // Check if student already exists
    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Generate studentId
    const studentId = await generateStudentId();


    const student = await Student.create({
      name,
      email,
      level,
      password: hashedPassword,
      studentId,
    })

    if (student) {
      console.log(`this is the created student ${student}`);
      return res.status(201).json({
      message: "Registration successful",
      studentId: student.studentId,
      name: student.name,
      email: student.email,
    });
      
    }

    
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error registering student", error: error.message });
  }
};

// 🔑 LOGIN
const loginStudent = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    // Find student by ID
    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Check password
    if (!student.password) return res.status(401).json({ message: "Account has no password set. Contact admin." });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate token
    const token = generateToken(student);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error logging in" });
  }
};

// 👤 GET STUDENT PROFILE
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json(student);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// 🎓 REGISTER COURSES
const registerCourses = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.registeredCourses = req.body.courseIds;
    await student.save();

    res.json({ message: "Courses registered successfully", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📚 GET REGISTERED COURSES
const getRegisteredCourses = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .populate("registeredCourses");
    if (!student)
      return res.status(404).json({ message: "Student not found" });

    res.status(200).json(student.registeredCourses);
  } catch (error) {
    console.error("Error fetching registered courses:", error);
    res.status(500).json({ message: "Error fetching registered courses" });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  getStudentProfile,
  registerCourses,
  getRegisteredCourses,
};
