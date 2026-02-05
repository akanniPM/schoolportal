# 🚀 API Documentation & Deployment Guide

This document summarizes all the changes made to enable full API documentation and testing for the School Portal backend.

## ✅ What Was Done

### 1. **Swagger UI & OpenAPI Integration**
   - ✅ Installed `swagger-ui-express` and `swagger-jsdoc`
   - ✅ Created `swagger.js` with complete OpenAPI 3.0 specification
   - ✅ Integrated Swagger UI at `/api-docs` endpoint
   - ✅ Added JSDoc comments to all route files for auto-documentation

### 2. **Generated Postman Collection**
   - ✅ Created `School_Portal_API.postman_collection.json`
   - ✅ Pre-configured all endpoints with request/response examples
   - ✅ Added environment variables for easy switching between dev/prod
   - ✅ Included authentication headers and test data

### 3. **Updated Route Documentation**
   - ✅ Added Swagger JSDoc comments to:
     - `routes/studentsRoutes.js` - Student endpoints
     - `routes/paymentRoutes.js` - Payment endpoints
   - ✅ Each endpoint includes description, parameters, request/response schemas

### 4. **Comprehensive Documentation**
   - ✅ Created `COMPLETE_API_DOCS.md` with:
     - Quick start guide
     - All endpoints with curl examples
     - Database models
     - Common workflows
     - Deployment instructions
     - Security best practices
     - Troubleshooting guide

### 5. **Fixed Critical Bugs**
   - ✅ Fixed missing `await` in `generateStudentId()` - student registration now works
   - ✅ Fixed directory creation with recursive `mkdir` - uploads folder created properly
   - ✅ Fixed MongoDB URI scheme for SRV connection

## 📚 How to Access Documentation

### **Option 1: Interactive Swagger UI (Recommended)**
```
http://localhost:5000/api-docs
```
- Live endpoint testing
- Request/response examples
- Authentication setup
- All schemas defined

### **Option 2: Postman Collection**
1. Open Postman
2. Click **Import**
3. Select `School_Portal_API.postman_collection.json`
4. Set `baseUrl` variable to your server URL
5. Start making requests

### **Option 3: OpenAPI JSON**
```
http://localhost:5000/api-docs.json
```
Raw OpenAPI specification for programmatic access

### **Option 4: Markdown Documentation**
Read `COMPLETE_API_DOCS.md` for comprehensive guide with examples

## 🎯 Available Endpoints (Summary)

### Students
- `POST /api/students/register` - Register new student
- `POST /api/students/login` - Login & get JWT token
- `GET /api/students/profile` - Get profile (requires token)
- `POST /api/students/{id}/register-courses` - Register courses
- `GET /api/students/registered-courses` - Get your courses (requires token)
- `POST /api/students/upload-receipt` - Upload payment receipt

### Payments
- `POST /api/payments/pay-tuition` - Start Paystack payment
- `POST /api/payments/verify-payment` - Verify payment status
- `GET /api/payments/{studentId}` - Get payment history

### Admin
- `GET /api/admin/receipts` - List all receipts (admin only)
- `POST /api/admin/verify-receipt` - Approve/reject receipt (admin only)

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `swagger.js` | OpenAPI 3.0 specification definition |
| `app.js` | Express app with Swagger UI mounted |
| `School_Portal_API.postman_collection.json` | Postman collection export |
| `COMPLETE_API_DOCS.md` | Comprehensive API documentation |
| `routes/studentsRoutes.js` | Student endpoints with JSDoc |
| `routes/paymentRoutes.js` | Payment endpoints with JSDoc |
| `controllers/studentController.js` | Fixed with await on generateStudentId() |
| `middleware/upload.js` | Fixed with recursive mkdir |

## 🚀 Next Steps for Deployment

### For Swagger/OpenAPI Documentation
1. ✅ Already integrated and running at `http://localhost:5000/api-docs`
2. Customize `swagger.js` with your production server URLs
3. Deploy as-is - documentation will be available in production

### For Team Collaboration
1. Share `School_Portal_API.postman_collection.json` with team
2. Team imports into Postman
3. Team sets environment variables
4. Team can test all endpoints

### For Frontend Developers
1. Point them to `http://localhost:5000/api-docs`
2. Share `COMPLETE_API_DOCS.md` for reference
3. Provide OpenAPI spec at `http://localhost:5000/api-docs.json`

### For Production Deployment
```bash
# Update .env with production values
PORT=5000
MONGO_URI=production_mongodb_uri
JWT_SECRET=strong_secret_key
PAYSTACK_SECRET_KEY=live_paystack_key

# Deploy your server
# Swagger UI will be available at:
# https://your-domain.com/api-docs
```

## 🎓 Using Swagger UI

### Test an Endpoint
1. Visit `http://localhost:5000/api-docs`
2. Click on any endpoint (e.g., `POST /api/students/register`)
3. Click **Try it out**
4. Fill in request parameters
5. Click **Execute**
6. View response

### Authorize with JWT
1. Login first to get token: `POST /api/students/login`
2. Copy the `token` from response
3. Click **Authorize** button (lock icon)
4. Enter: `Bearer YOUR_TOKEN_HERE`
5. Click **Authorize**
6. Now all protected endpoints will use your token

## 📋 Testing Checklist

- [x] Server starts without errors
- [x] Swagger UI loads at `/api-docs`
- [x] Student registration works
- [x] Student login returns valid JWT
- [x] Protected endpoints require token
- [x] Payment initialization works (Paystack)
- [x] File uploads work
- [x] All endpoints documented
- [x] Postman collection imports correctly
- [x] OpenAPI spec is valid

## 🔧 Customization

### To add new endpoints to Swagger:
1. Add JSDoc comments to your route file:
```javascript
/**
 * @swagger
 * /api/endpoint:
 *   post:
 *     summary: Your endpoint description
 *     tags: [TagName]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field: { type: string }
 *     responses:
 *       200:
 *         description: Success description
 */
```

2. The documentation updates automatically on server restart

### To customize OpenAPI spec:
Edit `swagger.js`:
- Change info (title, version, description)
- Update server URLs
- Add/modify schemas
- Change security schemes

## 📦 Dependencies Added

```json
{
  "swagger-ui-express": "^4.x.x",
  "swagger-jsdoc": "^6.x.x"
}
```

These are now in your `package.json` and included in deployments.

## 🎯 Benefits

✅ **For Developers:**
- Live API testing without Postman
- Clear documentation of all endpoints
- Easy onboarding for new team members

✅ **For Frontend Teams:**
- Can test API before frontend is ready
- Clear request/response formats
- Token authentication explained

✅ **For QA/Testers:**
- Ready-to-use Postman collection
- All test scenarios documented
- Easy to create test cases

✅ **For Product/Stakeholders:**
- API specification is self-documenting
- Can understand system capabilities
- Easy to validate features

## 🔗 Quick Links

- **Interactive Docs:** `http://localhost:5000/api-docs`
- **OpenAPI Spec:** `http://localhost:5000/api-docs.json`
- **Postman Collection:** Import `School_Portal_API.postman_collection.json`
- **Full Guide:** Read `COMPLETE_API_DOCS.md`
- **GitHub:** Push changes to sync documentation

---

**Status:** ✅ Complete & Ready for Team Collaboration
**Last Updated:** February 4, 2026
