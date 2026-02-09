# 🎯 Frontend Developer API Reference

Quick reference guide for integrating with the School Portal API.

## 🔗 Base URLs

- **Development:** `http://localhost:5000`
- **Production:** `https://your-app.onrender.com`
- **Documentation:** `https://your-app.onrender.com/api-docs`

## 🔐 Authentication

All protected endpoints require JWT token in header:

```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'application/json'
}
```

---

## 📚 Students API

### 1. Register Student

**Endpoint:** `POST /api/students/register`

**Request:**
```javascript
// JavaScript/Fetch
const response = await fetch('https://your-app.onrender.com/api/students/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Jane Doe",
    email: "jane@gmail.com",
    password: "Secret123",
    level: 1
  })
});
const data = await response.json();
```

**Response (201):**
```json
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "student": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "jane@gmail.com",
    "studentId": "STD2025001",
    "level": 1,
    "balance": 50000
  }
}
```

### 2. Login Student

**Endpoint:** `POST /api/students/login`

**Request:**
```javascript
// React Example
const handleLogin = async (email, password) => {
  try {
    const response = await fetch('https://your-app.onrender.com/api/students/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Store token in localStorage or state management
      localStorage.setItem('token', data.token);
      localStorage.setItem('student', JSON.stringify(data.student));
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "student": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "jane@gmail.com",
    "studentId": "STD2025001",
    "level": 1
  }
}
```

### 3. Get Profile (Protected)

**Endpoint:** `GET /api/students/profile`

**Request:**
```javascript
// Axios Example
import axios from 'axios';

const getProfile = async () => {
  const token = localStorage.getItem('token');
  
  const response = await axios.get(
    'https://your-app.onrender.com/api/students/profile',
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  return response.data;
};
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Jane Doe",
  "email": "jane@gmail.com",
  "studentId": "STD2025001",
  "level": 1,
  "balance": 45000,
  "registeredCourses": ["507f1f77bcf86cd799439012"],
  "grades": []
}
```

### 4. Register for Courses

**Endpoint:** `POST /api/students/{id}/register-courses`

**Request:**
```javascript
const registerCourses = async (studentId, courseIds) => {
  const response = await fetch(
    `https://your-app.onrender.com/api/students/${studentId}/register-courses`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseIds })
    }
  );
  return await response.json();
};

// Usage
await registerCourses('507f1f77bcf86cd799439011', [
  '507f1f77bcf86cd799439012',
  '507f1f77bcf86cd799439013'
]);
```

### 5. Get Registered Courses (Protected)

**Endpoint:** `GET /api/students/registered-courses`

**Request:**
```javascript
const token = localStorage.getItem('token');

const response = await fetch(
  'https://your-app.onrender.com/api/students/registered-courses',
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);
const data = await response.json();
```

**Response (200):**
```json
{
  "courses": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Introduction to Computer Science",
      "code": "CS101",
      "level": 1,
      "credits": 3
    }
  ]
}
```

### 6. Upload Payment Receipt

**Endpoint:** `POST /api/students/upload-receipt`

**Request:**
```javascript
const uploadReceipt = async (studentId, file) => {
  const formData = new FormData();
  formData.append('studentId', studentId);
  formData.append('receipt', file); // file from <input type="file">
  
  const response = await fetch(
    'https://your-app.onrender.com/api/students/upload-receipt',
    {
      method: 'POST',
      body: formData // Don't set Content-Type header, browser will set it
    }
  );
  
  return await response.json();
};

// React File Upload Example
const FileUpload = () => {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const studentId = localStorage.getItem('studentId');
    
    if (file) {
      const result = await uploadReceipt(studentId, file);
      console.log(result);
    }
  };
  
  return <input type="file" onChange={handleFileChange} accept="image/*,application/pdf" />;
};
```

---

## 💳 Payments API

### 1. Initialize Payment

**Endpoint:** `POST /api/payments/pay-tuition`

**Request:**
```javascript
const initializePayment = async (email, amount) => {
  const response = await fetch(
    'https://your-app.onrender.com/api/payments/pay-tuition',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, amount })
    }
  );
  
  const data = await response.json();
  
  // Redirect user to Paystack checkout
  if (data.status && data.data.authorization_url) {
    window.location.href = data.data.authorization_url;
  }
};
```

**Response (200):**
```json
{
  "status": true,
  "message": "Authorization URL created",
  "data": {
    "authorization_url": "https://checkout.paystack.com/xxxxx",
    "access_code": "xxxxx",
    "reference": "T123456789"
  }
}
```

### 2. Verify Payment

**Endpoint:** `POST /api/payments/verify-payment`

**Request:**
```javascript
// Call this after user returns from Paystack
const verifyPayment = async (reference, amountPaid) => {
  const response = await fetch(
    'https://your-app.onrender.com/api/payments/verify-payment',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference, amountPaid })
    }
  );
  
  return await response.json();
};

// Get reference from URL params
const urlParams = new URLSearchParams(window.location.search);
const reference = urlParams.get('reference');
if (reference) {
  await verifyPayment(reference, 50000);
}
```

### 3. Get Payment History

**Endpoint:** `GET /api/payments/{studentId}`

**Request:**
```javascript
const getPaymentHistory = async (studentId) => {
  const response = await fetch(
    `https://your-app.onrender.com/api/payments/${studentId}`
  );
  return await response.json();
};
```

**Response (200):**
```json
{
  "payments": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "student": "507f1f77bcf86cd799439011",
      "amount": 50000,
      "reference": "T123456789",
      "status": "success",
      "paidAt": "2026-02-09T10:30:00.000Z"
    }
  ]
}
```

---

## 📖 Courses API

### 1. Get All Courses

**Endpoint:** `GET /api/courses`

**Request:**
```javascript
const getAllCourses = async () => {
  const response = await fetch('https://your-app.onrender.com/api/courses');
  return await response.json();
};
```

### 2. Get Courses by Level

**Endpoint:** `GET /api/courses/level/{level}`

**Request:**
```javascript
const getCoursesByLevel = async (level) => {
  const response = await fetch(
    `https://your-app.onrender.com/api/courses/level/${level}`
  );
  return await response.json();
};

// Usage
const level1Courses = await getCoursesByLevel(1);
```

**Response (200):**
```json
{
  "courses": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Introduction to Computer Science",
      "code": "CS101",
      "description": "Basic programming concepts",
      "level": 1,
      "credits": 3
    }
  ]
}
```

---

## 🔒 Error Handling

All errors follow this format:

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

### Common Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response data |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Check request data |
| 401 | Unauthorized | Login required or token expired |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Retry or contact support |

### Error Handling Example

```javascript
const apiCall = async () => {
  try {
    const response = await fetch('https://your-app.onrender.com/api/students/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      const error = await response.json();
      
      switch (response.status) {
        case 401:
          // Token expired, redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 404:
          console.error('Resource not found');
          break;
        default:
          console.error('Error:', error.message);
      }
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
};
```

---

## 🛠️ TypeScript Interfaces

```typescript
interface Student {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  level: 1 | 2 | 3 | 4;
  balance: number;
  registeredCourses: string[];
  grades: Grade[];
  receipt?: {
    path: string;
    uploadedAt: string;
    status: 'pending' | 'approved' | 'rejected';
  };
}

interface Course {
  _id: string;
  title: string;
  code: string;
  description: string;
  level: number;
  instructor: string;
  credits: number;
}

interface Payment {
  _id: string;
  student: string;
  amount: number;
  reference: string;
  status: 'pending' | 'success' | 'failed';
  paidAt: string;
}

interface AuthResponse {
  token: string;
  student: Student;
}

interface Grade {
  course: string;
  grade: string;
  score: number;
}
```

---

## 📱 React Hooks Example

```javascript
// useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const login = async (email, password) => {
    const response = await fetch('https://your-app.onrender.com/api/students/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setToken(data.token);
      setUser(data.student);
      localStorage.setItem('token', data.token);
    }
    
    return data;
  };
  
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };
  
  return { user, token, login, logout };
};
```

---

## 🧪 Testing Endpoints

### Using JavaScript/Node.js

```javascript
// test.js
const BASE_URL = 'https://your-app.onrender.com';

async function testAPI() {
  // 1. Register
  const registerResponse = await fetch(`${BASE_URL}/api/students/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Test123',
      level: 1
    })
  });
  const registerData = await registerResponse.json();
  console.log('Register:', registerData);
  
  // 2. Login
  const loginResponse = await fetch(`${BASE_URL}/api/students/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'Test123'
    })
  });
  const loginData = await loginResponse.json();
  console.log('Login:', loginData);
  
  // 3. Get Profile
  const token = loginData.token;
  const profileResponse = await fetch(`${BASE_URL}/api/students/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const profileData = await profileResponse.json();
  console.log('Profile:', profileData);
}

testAPI();
```

---

## 📞 Support

- **Swagger Docs:** https://your-app.onrender.com/api-docs
- **OpenAPI Spec:** https://your-app.onrender.com/api-docs.json
- **Issues:** Contact backend team

Happy coding! 🚀
