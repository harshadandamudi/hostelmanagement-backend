const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String, required: true },
  razorpay_signature: { type: String, required: true },
  amount: { type: Number, required: true }, // in paise
  currency: { type: String, default: 'INR' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional, if you want to link to a user
  status: { type: String, default: 'success' }, // or 'failed'
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);