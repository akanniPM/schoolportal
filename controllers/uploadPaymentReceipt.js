exports.uploadPaymentReceipt = async (req, res) => {
    try {
      const { studentId, receipt } = req.body;
      const payment = await Payment.create({ studentId, receipt });
      res.status(201).json({ message: 'Payment receipt uploaded successfully!' });
    } catch (err) {
      res.status(500).json({ error: 'Error uploading payment receipt' });
    }
  };