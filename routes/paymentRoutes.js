const express = require("express");
const router = express.Router();
const { initializePayment, verifyPayment, getPaymentsByStudent } = require("../controllers/paymentController");
const { validatePaymentInput } = require("../middleware/validateInput");

/**
 * @swagger
 * /api/payments/pay-tuition:
 *   post:
 *     summary: Initialize Paystack payment for tuition
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, amount]
 *             properties:
 *               email:
 *                 type: string
 *                 example: jane@gmail.com
 *               amount:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     authorization_url:
 *                       type: string
 *                     access_code:
 *                       type: string
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error initializing payment
 */
router.post("/pay-tuition", validatePaymentInput, initializePayment);

/**
 * @swagger
 * /api/payments/verify-payment:
 *   post:
 *     summary: Verify Paystack payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reference, amountPaid]
 *             properties:
 *               reference:
 *                 type: string
 *                 example: "paystack_reference_123"
 *               amountPaid:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Payment verified and balance updated
 *       400:
 *         description: Payment verification failed
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.post("/verify-payment", verifyPayment);

/**
 * @swagger
 * /api/payments/{studentId}:
 *   get:
 *     summary: Get payment history for a student
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment history retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   student:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   reference:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [pending, success, failed]
 *                   paidAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: No payments found
 *       500:
 *         description: Error fetching payments
 */
router.get("/:studentId", getPaymentsByStudent);

module.exports = router;
