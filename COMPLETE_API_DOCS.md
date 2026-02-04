# School Portal API - Complete Documentation

A modern, production-ready backend API for a student management system with authentication, course enrollment, and payment processing.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Paystack account (for payments)

### Installation & Setup

1. **Clone and install**
```bash
git clone https://github.com/lightk147/schoolportal.git
cd schoolportal
npm install
```

2. **Configure environment**
```bash
# Create .env file with:
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
PAYSTACK_SECRET_KEY=sk_test_xxxxx
```

3. **Start the server**
```bash
npm start
```

Server runs on `http://localhost:5000`

## 📚 API Documentation

### Interactive Documentation
Visit **`http://localhost:5000/api-docs`** in your browser for:
- Swagger UI with all endpoints
- Live request testing
- Response schemas
- Authentication details

### Postman Collection
Import `School_Portal_API.postman_collection.json` into Postman for pre-configured requests.

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

**Get token by logging in:**
```bash
curl -X POST http://localhost:5000/api/students/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@gmail.com","password":"Secret123"}'
```

Token expires in **7 days** and includes user ID, email, and student ID.

## 📋 Core Endpoints

### Students (Public)
| Endpoint | Method | Description | Body |
|----------|--------|-------------|------|
| `/api/students/register` | POST | Register new student | name, email, password, level |
| `/api/students/login` | POST | Login & get token | email, password |
| `/api/students/{id}/register-courses` | POST | Register courses | courseIds[] |
| `/api/students/upload-receipt` | POST | Upload payment receipt | studentId, receipt (file) |

### Students (Protected - Requires Token)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/students/profile` | GET | Get your profile |
| `/api/students/registered-courses` | GET | Get your courses |

### Payments
| Endpoint | Method | Description | Body |
|----------|--------|-------------|------|
| `/api/payments/pay-tuition` | POST | Start Paystack payment | email, amount |
| `/api/payments/verify-payment` | POST | Verify payment status | reference, amountPaid |
| `/api/payments/{studentId}` | GET | Get payment history | — |

### Admin (Protected - Admin only)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/receipts` | GET | List all receipts |
| `/api/admin/verify-receipt` | POST | Approve/reject receipt |

## 🎯 Common Workflows

### 1. Student Registration & Login

**Register:**
```bash
curl -X POST http://localhost:5000/api/students/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@gmail.com",
    "password": "Secret123",
    "level": 1
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/students/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@gmail.com",
    "password": "Secret123"
  }'
```

**Response includes `token` - save this!**

### 2. Get Your Profile

```bash
curl -X GET http://localhost:5000/api/students/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Initialize Payment

```bash
curl -X POST http://localhost:5000/api/payments/pay-tuition \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@gmail.com",
    "amount": 5000
  }'
```

**Response:** Get `authorization_url` from Paystack to complete payment

### 4. Verify Payment After Completion

```bash
curl -X POST http://localhost:5000/api/payments/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "paystack_reference_from_checkout",
    "amountPaid": 5000
  }'
```

## 🗄️ Database Models

### Student
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,           // unique
  password: String,        // bcrypt hashed
  studentId: String,       // auto-generated (STD2025001)
  level: Number,          // 1-4
  registeredCourses: [ObjectId], // course references
  balance: Number,        // tuition balance
  receipt: {
    path: String,
    uploadedAt: Date,
    status: String        // pending, approved, rejected
  }
}
```

### Payment
```javascript
{
  _id: ObjectId,
  student: ObjectId,
  amount: Number,
  reference: String,      // Paystack reference
  status: String,        // success, failed, pending
  paidAt: Date
}
```

### Course
```javascript
{
  _id: ObjectId,
  title: String,
  code: String,
  description: String,
  level: Number,        // 1-4
  instructor: ObjectId  // ref to Instructor
}
```

## 🚨 Error Handling

All errors follow this format:

```json
{
  "error": "Specific error message",
  "message": "Human-readable description"
}
```

### Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Validation error | Check request body format |
| 401 | No token provided | Add `Authorization: Bearer TOKEN` header |
| 401 | Invalid token | Token expired or incorrect secret |
| 404 | Student not found | Verify email or student ID |
| 500 | Server error | Check server logs |

## 📂 Project Structure

```
schoolportal/
├── models/                      # Mongoose schemas
│   ├── Student.js              # Student schema
│   ├── Course.js               # Course schema
│   ├── Payment.js              # Payment schema
│   ├── Instructor.js           # Instructor schema
│   └── Admin.js                # Admin schema
│
├── controllers/                 # Business logic
│   ├── studentController.js    # Student operations
│   ├── courseController.js     # Course operations
│   ├── paymentController.js    # Payment operations
│   └── ...
│
├── routes/                      # API endpoints
│   ├── studentsRoutes.js       # /api/students routes
│   ├── paymentRoutes.js        # /api/payments routes
│   ├── course.js               # /api/courses routes
│   ├── admin.js                # /api/admin routes
│   └── ...
│
├── middleware/                  # Custom middleware
│   ├── authMiddleware.js       # JWT verification
│   ├── validateInput.js        # Input validation
│   ├── upload.js               # File upload (Multer)
│   └── authenticateStudent.js  # Student auth
│
├── utils/                       # Helper functions
│   ├── generateStudentId.js    # Auto-generate student IDs
│   ├── sendStudentIdEmail.js   # Email notifications
│   └── validateEmail.js        # Email validation
│
├── config/                      # Configuration
│   └── index.js                # App configuration
│
├── uploads/                     # Local file storage
├── swagger.js                   # OpenAPI specification
├── app.js                       # Express app setup
├── server.js                    # Server entry point
├── .env                         # Environment variables
├── package.json                 # Dependencies
├── School_Portal_API.postman_collection.json  # Postman export
└── README.md                    # This file
```

## 🔧 Configuration

### Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_key_minimum_32_characters

# Email (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password (from Gmail settings)

# Payment Gateway
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx

# Cloud Storage (Optional)
CLOUDNAME=cloudinary_name
CLOUDKEY=cloudinary_api_key
CLOUDSECRET=cloudinary_api_secret
```

**Note:** Use Gmail App Password if 2FA is enabled: [Generate here](https://myaccount.google.com/apppasswords)

## 🌐 Deployment

### Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URI=your_production_uri
heroku config:set JWT_SECRET=your_production_secret
heroku config:set PAYSTACK_SECRET_KEY=your_live_key

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Railway / Render Deployment

1. Connect GitHub repository
2. Set environment variables in dashboard
3. Auto-deploy on push to main branch

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t schoolportal .
docker run -p 5000:5000 --env-file .env schoolportal
```

## 🔒 Security Best Practices

✅ **Do:**
- Use HTTPS in production
- Keep JWT_SECRET strong and unique
- Validate all user inputs
- Hash passwords with bcrypt
- Use environment variables for secrets
- Implement rate limiting
- Log suspicious activities

❌ **Don't:**
- Commit `.env` file
- Use weak passwords
- Expose error details to clients
- Log sensitive data
- Use hardcoded credentials
- Disable TLS verification in production

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error:** `Error: ENOTFOUND _mongodb._tcp.cluster0...`

**Solutions:**
- Check MongoDB URI in `.env`
- Whitelist your IP in MongoDB Atlas
- Verify username and password
- Try using non-SRV connection string

### Token Validation Errors

**Error:** `Invalid token`

**Solutions:**
- Verify JWT_SECRET matches
- Check token hasn't expired (7 days)
- Ensure proper header format: `Bearer TOKEN`
- Re-login to get fresh token

### Payment Initialization Fails

**Solutions:**
- Verify PAYSTACK_SECRET_KEY
- Use valid email format
- Ensure amount > 0
- Check network connectivity
- Test with Paystack test key first

## 📞 Support & Contributing

### Report Issues
- Open GitHub issue with details
- Include error logs and steps to reproduce
- Specify environment (local/production)

### Contributing
1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add feature"`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request

## 📄 License

This project is maintained by the School Portal team.

## 📞 Contact

- **Email**: support@schoolportal.com
- **Issues**: GitHub Issues
- **Docs**: http://localhost:5000/api-docs

---

**Latest Update:** February 2026  
**Version:** 1.0.0
