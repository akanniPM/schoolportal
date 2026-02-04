const axios = require("axios");
const Student = require("../models/Student");
const Payment = require("../models/Payment"); // We'll create this model

const initializePayment = async (req, res) => {
  const { email, amount } = req.body;

  console.log("Payment request received:", { email, amount });
  console.log("Paystack key exists:", !!process.env.PAYSTACK_SECRET_KEY);

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      { email, amount: amount * 100 }, // Paystack expects amount in kobo
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Initialize Error:", error.response?.data || error.message);
    console.error("Full error:", error);
    res.status(500).json({ message: "Error initializing payment." });
  }
};


const verifyPayment = async (req, res) => {
  const { reference, amountPaid } = req.body;

  try {
    // ✅ Verify with Paystack
    console.log("Verifying payment with reference:", process.env.PAYSTACK_SECRET_KEY);
    const paystackRes = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = paystackRes.data.data;

    if (data.status !== "success") {
      return res.status(400).json({ message: "Payment verification failed." });
    }

    // ✅ Get student by email
    const student = await Student.findOne({ email: data.customer.email });
    console.log("Paystack email:", data.customer.email);

    if (!student) return res.status(404).json({ message: "Student not found" });

    // ✅ Save payment to DB
    const payment = new Payment({
      student: student._id,
      amount: amountPaid,
      reference: reference,
      status: "success",
      paidAt: data.paid_at,
    });

    await payment.save();

    // ✅ Update student's balance
    if (typeof student.balance !== 'number') {
      student.balance = 0; // Ensure balance is a number
    }
    student.balance -= amountPaid;
    await student.save();

    res.status(200).json({ message: "Payment verified and balance updated." });

  } catch (error) {
    console.error("Verify Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Server error verifying payment." });
  }
};

const getPaymentsByStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const payments = await Payment.find({ student: studentId }).sort({ paidAt: -1 });
    if (!payments.length) {
      return res.status(404).json({ message: "No payments found for this student." });
    }

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error.message);
    res.status(500).json({ message: "Error fetching payments." });
  }
};
module.exports = { initializePayment, verifyPayment, getPaymentsByStudent };
