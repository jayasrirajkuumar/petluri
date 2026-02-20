const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create a razorpay order
router.post('/create-order', paymentController.createOrder);

// Verify a razorpay order
router.post('/verify', paymentController.verifyPayment);

// Handle free enrollment
router.post('/enroll-free', paymentController.enrollFree);

module.exports = router;
