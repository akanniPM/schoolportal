// tuitionController.js
exports.getTuitionDetails = async (req, res) => {
    try {
      const studentId = req.params.studentId;
      const student = await Student.findById(studentId);
      // Assuming tuition details are stored in the student model
      res.json({ tuition: student.tuition });
    } catch (err) {
      res.status(500).json({ error: 'Error fetching tuition details' });
    }
  };