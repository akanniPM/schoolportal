const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  amount: { type: Number, required: true },
  reference: { type: String, required: true, unique: true },
  status: { type: String, default: "success" },
  paidAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
