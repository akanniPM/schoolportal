# API Test Examples

Replace `http://localhost:5000` with your server base URL.

- Register student

```bash
curl -X POST http://localhost:5000/students/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"Secret123","studentId":"S12345"}'
```

- Login student

```bash
curl -X POST http://localhost:5000/students/login \
  -H "Content-Type: application/json" \
  -d '{
  "studentId": "STD2025003",
  "password":"123456"
}'
```

- Get profile (use token from login)

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:5000/students/profile
```

- Initialize payment (Paystack)

```bash
curl -X POST http://localhost:5000/payments/pay-tuition \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","amount":5000}'
```

- Verify payment

```bash
curl -X POST http://localhost:5000/payments/verify-payment \
  -H "Content-Type: application/json" \
  -d '{"reference":"<PAYSTACK_REF>","amountPaid":5000}'
```

- Upload receipt (multipart/form-data)

```bash
curl -X POST http://localhost:5000/students/upload-receipt \
  -F "studentId=S12345" \
  -F "receipt=@/path/to/receipt.pdf"
```

- Admin: list receipts (requires admin token)

```bash
curl -H "Authorization: Bearer <ADMIN_TOKEN>" http://localhost:5000/admin/receipts
```

- Admin: verify receipt

```bash
curl -X POST http://localhost:5000/admin/verify-receipt \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"studentId":"S12345","status":"approved"}'
```

- Get student payments

```bash
curl http://localhost:5000/payments/<studentId>
```


If you want, I can produce a Postman collection JSON next.
