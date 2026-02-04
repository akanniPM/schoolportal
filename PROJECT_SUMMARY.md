# School Portal Backend — Project Summary

## What the code is (overview)
This repository is a Node.js + Express backend for a Student Portal using MongoDB via Mongoose. It provides APIs for:
- Student registration and login
- Course creation and course-by-level queries
- Student course registration and grade tracking
- Instructor registration and grading
- Admin operations (payment/receipt review, credential generation)
- Payment handling via Paystack (initialize + verify)
- Receipt upload using Multer and basic file storage
- Email notifications via Nodemailer

Core entry points and structure:
- `server.js` — connects to MongoDB and starts the server
- `app.js` — configures middleware and mounts routes
- `controllers/` — business logic for auth, students, payments, courses, instructors, admin
- `models/` — Mongoose schemas (`Student`, `Course`, `Instructor`, `Payment`, `Admin`)
- `routes/` — Express routes for each area
- `middleware/` — auth, upload, and helpers
- `utils/` — helpers (ID/password generators, email sender)

## What has been achieved (implemented features)
- Student signup/login flows with generated Student IDs and email sending
- JWT-based authentication in several places (inconsistent implementations)
- Course CRUD and retrieving courses by level
- Student course registration and retrieval endpoints
- Paystack integration for initializing and verifying payments
- Payment record model and saving verified payments
- Receipt upload endpoint and admin receipt approval endpoint
- Utilities to generate usernames/passwords and send emails

## Current bugs & inconsistencies (observed)
- **FIXED**: Typos and logic bugs in `controllers/authController.js` (`erro`, `statu`, referencing `studentId` before defined).
- **FIXED**: Import mismatch: `controllers/instructorController.js` imports `../models/studentModel` instead of `../models/Student`.
- **FIXED**: `Student` model lacked fields used by code (`balance`, `grades` structure, and consistent `receipt` shape).
- **FIXED**: Plaintext password handling: `routes/instructorAuth.js` compared plaintext; `models/Admin.js` stored unhashed passwords.
- **ADDITIONAL FOUND**: Receipt upload inconsistency: `routes/studentsRoutes.js` (line 49) stores receipt as string path (`student.receipt = filePath`), but `routes/admin.js` (lines 86, 90) expects object with `.path` and `.status` properties. Need unified handling.
- **ADDITIONAL FOUND**: `tuitionController.js` tries to access `student.tuition` field which doesn't exist in Student model; function is incomplete.
- **ADDITIONAL FOUND**: Auth field inconsistency: `controllers/studentController.js` reads `req.student.id` (line 98, 126), but `routes/auth.js` middleware sets `req.user.id` (line 17). Inconsistent access patterns.
- **ADDITIONAL FOUND**: `routes/auth.js` has `/admin/login` endpoint but no proper Admin model validation or JWT generation (typo prone).
- **ADDITIONAL FOUND**: Missing middleware on many admin routes: routes like `router.get('/instructors')`, `router.put('/instructors/:id')`, `router.delete('/students/:id/credentials')` lack `verifyToken` and `isAdmin` checks.
- **ADDITIONAL FOUND**: `routes/instructorAdmin.js` file referenced but not fully checked — likely incomplete or missing routes.
- **ADDITIONAL FOUND**: `utils/validateEmail.js` utility is imported but not checked for correctness.
- Duplicate helper implementations (multiple `generateStudentId`) — now consolidated but some remain scattered.
- Missing `.env` file and required environment variables (`MONGO_URI`, `JWT_SECRET`, `PAYSTACK_SECRET_KEY`, `EMAIL_USER`, `EMAIL_PASS`, etc.).
- Lack of input validation (missing required fields, type checking) and consistent error handling across endpoints.

## Remaining tasks to get full functionality (priority order)
Priority 1 — required to run correctly:
- ✅ Create `.env` with required keys and ensure `dotenv` loads before use.
- ✅ Fix critical bugs in `controllers/authController.js` and normalize `generateStudentId` usage.
- ✅ Update `models/Student.js` to include `balance`, `grades` (as array), and unified `receipt` object.
- ✅ Fix import names and ensure all controllers import correct models.
- ✅ Hash passwords for `Admin` and `Instructor` using `bcryptjs` and update login flows to use `bcrypt.compare`.
- ✅ Update `routes/instructorAuth.js` to issue JWT and use hashed passwords.
- 🔄 **Standardize authentication**: fix `req.user.id` vs `req.student.id` inconsistency across all files; use consistent `req.user.id` everywhere.
- 🔄 **Fix receipt upload storage**: unify receipt handling in `routes/studentsRoutes.js` to store `{ path, uploadedAt, status }` object (not just string path).
- 🔄 **Add middleware guards**: protect all sensitive admin/instructor routes with `verifyToken` + `isAdmin`/`isInstructor` checks.

Priority 2 — functionality & security:
- Complete `tuitionController.js` (remove reference to non-existent `student.tuition` field).
- Complete `uploadPaymentReceipt.js` implementation.
- Complete `routes/instructorAdmin.js` routes.
- Standardize and improve Paystack verification: validate amounts, ensure webhooks or async handling.
- Add input validation (express-validator or custom checks) for all endpoints.
- Consolidate `generateStudentId` implementations to single location.
- Verify `utils/validateEmail.js` is working correctly.

Priority 3 — polish and ops:
- Add CORS whitelisting, rate limiting, and request logging.
- Add tests, a seed script, and a `README.md` with run instructions.
- Add Dockerfile / deployment config.

## Suggested future features / UX improvements
- Student dashboard endpoints consolidating enrolled courses, payment history, balance, and grades.
- Admin dashboard endpoints with filters, CSV export, and analytics.
- Paystack webhooks for reliable payment status updates.
- Email notifications for key events (receipt approved/rejected, payment success, password reset).
- Password reset flow and forced password change on first login.
- Role-based dashboards and RBAC middleware for fine-grained permissions.
- Pagination, search, and filtering for large lists (students, courses, payments).
- Move file storage to cloud (S3) with signed URLs; add virus scanning for uploads.
- Audit logs for critical admin actions.

## Quick run checklist
1. Create `.env` with at minimum:
   - `MONGO_URI`, `JWT_SECRET`, `PAYSTACK_SECRET_KEY`, `EMAIL_USER`, `EMAIL_PASS`, `PORT`, `NODE_ENV`
2. Install dependencies:
```bash
npm install
```
3. Start dev server:
```bash
npm run dev
```
4. Seed at least one `Admin`/`Instructor`/`Student` for testing or register via API.

## Next recommended implementation steps (I can do these for you)
**PRIORITY 1 - COMPLETED:**
- ✅ Fixed critical bugs in `authController.js` (typos `erro`→`error`, `statu`→`status`, logic ordering).
- ✅ Standardized JWT auth: changed `req.student.id` to `req.user.id` across `studentController.js`.
- ✅ Updated `models/Student.js` to include `balance`, `grades` array, and unified `receipt` object.
- ✅ Fixed import in `instructorController.js`.
- ✅ Hashed passwords in `Admin` model and updated `instructorAuth.js` to use bcrypt + JWT.
- ✅ Fixed receipt upload to store as object `{ path, uploadedAt, status }`.
- ✅ Added `verifyToken` + `isAdmin` middleware guards to sensitive admin routes.
- ✅ Created `.env.example` template.

**PRIORITY 2 - COMPLETED:**
- ✅ **tuitionController.js**: Implemented proper tuition fee logic with balance calculation.
- ✅ **uploadPaymentReceipt.js**: Completed implementation with receipt status tracking.
- ✅ **instructorAdmin.js**: Expanded with profile endpoints, grade submission, and student management.
- ✅ **Input validation**: Created `middleware/validateInput.js` with validators for signup, payments, courses, grades.
- ✅ **generateStudentId consolidation**: Created `utils/generateStudentId.js` as single source of truth.
- ✅ **validateEmail.js**: Verified working correctly (Gmail-only validation).
- ✅ **Route validation integration**: Added validation middleware to `/api/students`, `/api/courses`, `/api/payments`.
- ✅ **Tuition routes**: Created `/api/tuition` endpoints for balance queries.
- ✅ **README.md**: Comprehensive setup guide with examples.

**Still needed (Priority 3 - Polish & Ops):**
- Add rate limiting (express-rate-limit)
- Add request logging (morgan or winston)
- Add request size limits
- CORS whitelist configuration
- Error handling middleware
- Tests (Jest/Mocha)
- Seed script for demo data
- Dockerfile / docker-compose
- Paystack webhook handler

---

Generated and saved by the repo analysis assistant. If you want, I can now start applying the Priority 1 fixes (bug fixes, model updates, and auth standardization).