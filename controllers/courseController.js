const Course = require("../models/Course");
// // In backend - coursesController.js
//   exports.getCoursesByLevel = async (req, res) => {
//     const { level } = req.params;
//     const courses = await Course.find({ level });
//     res.json(courses);
//   };

  // exports.createCourse = async (req, res) => {
  //   try {
  //     const { title, code, description, level } = req.body;
  
  //     const course = new Course({
  //       title,
  //       code,
  //       description,
  //       level,
  //     });
  
  //     await course.save();
  
  //     res.status(201).json(course);
  //   } catch (error) {
  //     console.error("🔥 Course creation failed:", error); // LOG THE ERROR
  //     res.status(500).json({ message: "Internal server error", error: error.message });
  //   }
  // };

  exports.createCourse = async (req, res) => {
    try {
      const { title, code, description, level } = req.body;
  
      console.log("📥 Creating course with:", req.body); // Optional
  
      const course = new Course({
        title,
        code,
        description,
        level,
      });
  
      await course.save();
  
      res.status(201).json(course);
    } catch (error) {
      console.error("❌ Course creation error:", error);
      if (error.code === 11000) {
        return res.status(400).json({ message: "Course code already exists." });
      }
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  
  
  