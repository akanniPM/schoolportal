# School Portal Backend - Setup & Run Guide

## Overview
A Node.js/Express backend API for a student portal with:
- Student registration, authentication, and profile management
- Course management and registration
- Payment processing (Paystack integration)
- Instructor and admin dashboards
- Receipt upload and verification
- Grade management

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Postman/Insomnia (for API testing)

## Installation

### 1. Clone/Setup
```bash
cd schoolportal
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

Edit `.env` with:
```env
MONGO_URI=mongodb://localhost:27017/schoolportal
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
PAYSTACK_SECRET_KEY=your_paystack_secret
PAYSTACK_PUBLIC_KEY=your_paystack_public
```

**Note**: For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) if 2FA is enabled.

### 3. Start MongoDB
If local:
```bash
mongod
```

### 4. Start the Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

---

## API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Student registration (Gmail required)
- `POST /login` - Student login with studentId + password
- `POST /admin/login` - Admin login
- `POST /instructor-login` - Instructor login
- `GET /student/me` - Get current student profile (auth required)

### Courses (`/api/courses`)
- `GET /` - Get all courses
- `GET /:level` - Get courses by level (1-4)
- `POST /` - Create course (admin only)
- `PUT /:id` - Update course (admin only)
- `DELETE /:id` - Delete course (admin only)

### Students (`/api/students`)
- `POST /register` - Register new student
- `POST /login` - Student login
- `GET /profile` - Get student profile (auth required)
- `POST /:id/register-courses` - Register for courses
- `GET /registered-courses` - Get student's courses (auth required)
- `POST /upload-receipt` - Upload payment receipt
- `POST /verify-payment` - Verify Paystack payment

### Payments (`/api/payments`)
- `POST /pay-tuition` - Initialize Paystack payment
- `POST /verify-payment` - Verify payment with Paystack
- `GET /:studentId` - Get payment history for student

### Tuition (`/api/tuition`)
- `GET /:studentId` - Get tuition details and balance
- `GET /balance/current` - Get current student's balance (auth required)

### Admin (`/api/admin`)
- `GET /payments` - View all payments
- `PATCH /payments/:id/status` - Update payment status
- `GET /receipts` - Get pending receipts (admin only)
- `POST /verify-receipt` - Approve/reject receipt (admin only)
- `POST /students/:id/generate-credentials` - Generate student login (admin only)
- `POST /generate-user` - Create new user (admin only)
- `GET /instructors` - List instructors (admin only)
- `PUT /instructors/:id` - Update instructor (admin only)
- `DELETE /instructors/:id` - Delete instructor (admin only)

### Instructors (`/api/instructor-auth` & `/api/instructor-admin`)
- `POST /login` - Instructor login
- `GET /` - Get all instructors
- `GET /profile` - Get instructor profile (auth required)
- `GET /:id/courses` - Get instructor's assigned courses
- `GET /:id/students` - Get students in instructor's courses
- `POST /:instructorId/grade/:studentId/:courseId` - Submit grade
- `GET /:instructorId/course/:courseId/grades` - View grades for a course

---

## Request/Response Examples

### Student Signup
```bash
curl -X POST http://localhost:5000/api/students/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@gmail.com",
    "password": "password123",
    "level": 1
  }'
```

### Student Login
```bash
curl -X POST http://localhost:5000/api/students/login \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STD2025001",
    "password": "password123"
  }'
```

### Create Course
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Introduction to Programming",
    "code": "CS101",
    "level": 1,
    "description": "Learn basics of programming"
  }'
```

### Upload Receipt
```bash
curl -X POST http://localhost:5000/api/students/upload-receipt \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "receipt=@receipt.pdf" \
  -F "studentId=STD2025001"
```

---

## Validation Rules

### Student Signup
- Name: required, non-empty string
- Email: Gmail address only (@gmail.com)
- Password: minimum 6 characters
- Level: integer between 1-4 (optional, defaults to 1)

### Payment
- Email: valid Gmail address
- Amount: positive number, max 1,000,000

### Course
- Title: required, non-empty string
- Code: required, unique (auto-checked by DB)
- Level: integer between 1-4

### Grade
- Valid grades: A, B, C, D, E, F

---

## Database Models

### Student
```javascript
{
  name: String,
  email: String (unique),
  studentId: String (unique),
  level: Number,
  password: String (hashed),
  courses: [ObjectId] (Course references),
  grades: [{ course: ObjectId, grade: String }],
  balance: Number,
  receipt: {
    path: String,
    uploadedAt: Date,
    status: String // 'pending' | 'approved' | 'rejected'
  },
  receiptVerified: Boolean
}
```

### Course
```javascript
{
  title: String,
  code: String (unique),
  description: String,
  level: Number
}
```

### Instructor
```javascript
{
  name: String,
  email: String (unique, Gmail),
  instructorId: String (unique),
  username: String (unique),
  password: String (hashed),
  assignedCourses: [ObjectId] // Course references
}
```

### Payment
```javascript
{
  student: ObjectId (Student reference),
  amount: Number,
  reference: String (Paystack ref, unique),
  status: String,
  paidAt: Date
}
```

---

## Common Issues & Solutions

### "MongoDB connection error"
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in `.env` is correct

### "JWT_SECRET not found"
- Add `JWT_SECRET` to `.env`

### "Gmail authentication failed"
- Use [App Password](https://support.google.com/accounts/answer/185833), not regular password
- Ensure `EMAIL_USER` and `EMAIL_PASS` are in `.env`

### "Paystack payment verification failed"
- Verify `PAYSTACK_SECRET_KEY` is correct
- Ensure payment reference exists in Paystack

### Duplicate key error (E11000)
- Remove the indexed field from the document or ensure uniqueness
- MongoDB stores unique indices; restart MongoDB or clear duplicates

---

## Testing with Postman

1. **Import** the API URL: `http://localhost:5000`
2. **Create a Student**:
   - POST `/api/students/register`
   - Body: `{ "name", "email", "password", "level" }`
3. **Login**:
   - POST `/api/students/login`
   - Body: `{ "studentId", "password" }`
   - Save the returned JWT token
4. **Use JWT in headers**:
   - Authorization: `Bearer <token>`

---

## Next Steps

- Implement webhooks for Paystack async notifications
- Add logging and monitoring
- Set up CI/CD pipeline
- Create frontend React/Vue application
- Deploy to production (Heroku, AWS, DigitalOcean)

---

## Support & Contributions

For issues or improvements, create an issue or PR in the repository.
