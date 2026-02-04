const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Portal API',
      version: '1.0.0',
      description: 'API for student registration, course management, payments, and admin functions',
      contact: {
        name: 'School Portal Team',
        email: 'support@schoolportal.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.schoolportal.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Student: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            studentId: { type: 'string' },
            level: { type: 'integer', minimum: 1, maximum: 4 },
            registeredCourses: { type: 'array', items: { type: 'string' } },
            balance: { type: 'number' },
            receipt: {
              type: 'object',
              properties: {
                path: { type: 'string' },
                uploadedAt: { type: 'string', format: 'date-time' },
                status: { type: 'string', enum: ['pending', 'approved', 'rejected'] }
              }
            }
          }
        },
        Payment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            student: { type: 'string' },
            amount: { type: 'number' },
            reference: { type: 'string' },
            status: { type: 'string', enum: ['success', 'failed', 'pending'] },
            paidAt: { type: 'string', format: 'date-time' }
          }
        },
        Course: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            code: { type: 'string' },
            description: { type: 'string' },
            level: { type: 'integer', minimum: 1, maximum: 4 },
            instructor: { type: 'string' }
          }
        }
      }
    }
  },
  apis: [
    './routes/studentsRoutes.js',
    './routes/auth.js',
    './routes/paymentRoutes.js',
    './routes/course.js',
    './routes/tuitionRoutes.js',
    './routes/admin.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
