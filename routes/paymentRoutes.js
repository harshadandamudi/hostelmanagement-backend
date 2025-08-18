const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const dotEnv = require('dotenv');
const Payment = require('../models/payment'); // adjust path as needed
const crypto = require('crypto');

dotEnv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


// ...existing code...

router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency, userId } = req.body;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  const generated_signature = crypto
    .createHmac('sha256', key_secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    // Save payment to DB
    try {
      const payment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,
        currency,
        user: userId, // pass userId from frontend if you want to link payment to user
        status: 'success'
      });
      await payment.save();
      res.json({ success: true, message: 'Payment verified and saved!' });
    } catch (err) {
        console.error('Error saving payment:', err);
      res.status(500).json({ success: false, message: 'Payment verified but failed to save!', error: err });
    }
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    console.log('Received amount from frontend:', amount);
    const options = {
      amount: amount * 100, // amount in paise (e.g., 500 INR = 50000 paise)
      currency,
      receipt,
      payment_capture: 1
      
    };
    console.log('Options sent to Razorpay:', options);
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error creating order', error: err });
  }
});


module.exports = router;