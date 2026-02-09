const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Portal API',
      version: '1.0.0',
      description: 'A comprehensive REST API for managing students, courses, instructors, payments, and administrative tasks in a school management system.',
      contact: {
        name: 'School Portal Support',
        email: 'support@schoolportal.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://your-app.onrender.com',
        description: 'Production server (Render)'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token obtained from login'
        }
      },
      schemas: {
        // Student Schemas
        Student: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', format: 'email', example: 'jane@gmail.com' },
            studentId: { type: 'string', example: 'STD2025001' },
            level: { type: 'integer', minimum: 1, maximum: 4, example: 1 },
            balance: { type: 'number', example: 50000 },
            registeredCourses: {
              type: 'array',
              items: { type: 'string' }
            },
            grades: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  course: { type: 'string' },
                  grade: { type: 'string', example: 'A' },
                  score: { type: 'number', example: 85 }
                }
              }
            },
            receipt: {
              type: 'object',
              properties: {
                path: { type: 'string' },
                uploadedAt: { type: 'string', format: 'date-time' },
                status: { type: 'string', enum: ['pending', 'approved', 'rejected'] }
              }
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        StudentRegistration: {
          type: 'object',
          required: ['name', 'email', 'password', 'level'],
          properties: {
            name: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', format: 'email', example: 'jane@gmail.com' },
            password: { type: 'string', format: 'password', minLength: 6, example: 'Secret123' },
            level: { type: 'integer', minimum: 1, maximum: 4, example: 1 }
          }
        },
        StudentLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'jane@gmail.com' },
            password: { type: 'string', format: 'password', example: 'Secret123' }
          }
        },

        // Course Schemas
        Course: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439012' },
            title: { type: 'string', example: 'Introduction to Computer Science' },
            code: { type: 'string', example: 'CS101' },
            description: { type: 'string', example: 'Basic programming concepts and algorithms' },
            level: { type: 'integer', minimum: 1, maximum: 4, example: 1 },
            instructor: { type: 'string', example: '507f1f77bcf86cd799439013' },
            credits: { type: 'number', example: 3 },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        CourseCreate: {
          type: 'object',
          required: ['title', 'code', 'level'],
          properties: {
            title: { type: 'string', example: 'Introduction to Computer Science' },
            code: { type: 'string', example: 'CS101' },
            description: { type: 'string', example: 'Basic programming concepts' },
            level: { type: 'integer', minimum: 1, maximum: 4, example: 1 },
            instructor: { type: 'string', example: '507f1f77bcf86cd799439013' },
            credits: { type: 'number', example: 3 }
          }
        },

        // Payment Schemas
        Payment: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439014' },
            student: { type: 'string', example: '507f1f77bcf86cd799439011' },
            amount: { type: 'number', example: 50000 },
            reference: { type: 'string', example: 'T123456789' },
            status: { type: 'string', enum: ['pending', 'success', 'failed'], example: 'success' },
            paidAt: { type: 'string', format: 'date-time' }
          }
        },
        PaymentInitiate: {
          type: 'object',
          required: ['email', 'amount'],
          properties: {
            email: { type: 'string', format: 'email', example: 'jane@gmail.com' },
            amount: { type: 'number', minimum: 100, example: 50000 }
          }
        },
        PaymentVerify: {
          type: 'object',
          required: ['reference', 'amountPaid'],
          properties: {
            reference: { type: 'string', example: 'T123456789' },
            amountPaid: { type: 'number', example: 50000 }
          }
        },

        // Instructor Schemas
        Instructor: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439015' },
            name: { type: 'string', example: 'Dr. John Smith' },
            email: { type: 'string', format: 'email', example: 'john.smith@school.edu' },
            department: { type: 'string', example: 'Computer Science' },
            courses: {
              type: 'array',
              items: { type: 'string' }
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },

        // Generic Schemas
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            student: { $ref: '#/components/schemas/Student' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Error message' },
            message: { type: 'string', example: 'Detailed error description' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' }
          }
        }
      }
    },
    tags: [
      {
        name: 'Students',
        description: 'Student registration, authentication, and profile management'
      },
      {
        name: 'Courses',
        description: 'Course creation, retrieval, and enrollment'
      },
      {
        name: 'Payments',
        description: 'Payment processing and verification via Paystack'
      },
      {
        name: 'Admin',
        description: 'Administrative operations (requires admin authentication)'
      },
      {
        name: 'Instructors',
        description: 'Instructor management and grading operations'
      }
    ]
  },
  apis: ['./routes/*.js'] // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
