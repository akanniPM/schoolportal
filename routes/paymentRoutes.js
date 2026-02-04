const express = require("express");
const router = express.Router();
const { initializePayment, verifyPayment, getPaymentsByStudent } = require("../controllers/paymentController");
const { validatePaymentInput } = require("../middleware/validateInput");

router.post("/pay-tuition", validatePaymentInput, initializePayment);
router.post("/verify-payment", verifyPayment);
router.get("/:studentId", getPaymentsByStudent);

module.exports = router;
