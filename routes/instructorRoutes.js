// POST /api/instructor/course/:courseId/grade
router.post('/course/:courseId/grade', async (req, res) => {
    const { courseId } = req.params;
    const { grades } = req.body;
  
    try {
      // Loop through submitted grades
      for (const studentId in grades) {
        const gradeValue = grades[studentId];
  
        // You can store grades as a sub-document or in a Grade model. Here's a simple example:
        await Student.updateOne(
          { _id: studentId, 'courses.courseId': courseId },
          {
            $set: {
              'courses.$.grade': gradeValue
            }
          }
        );
      }
  
      res.status(200).json({ message: 'Grades submitted successfully' });
    } catch (error) {
      console.error('Grading error:', error);
      res.status(500).json({ message: 'Failed to submit grades' });
    }
  });
  