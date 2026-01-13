const express = require("express");
const router = express.Router();
const { initializePayment, verifyPayment, getPaymentsByStudent } = require("../controllers/paymentController");

router.post("/pay-tuition", initializePayment);
router.post("/verify-payment", verifyPayment);
router.get("/:studentId", getPaymentsByStudent);

module.exports = router;
