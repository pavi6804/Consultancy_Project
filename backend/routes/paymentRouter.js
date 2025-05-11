const express = require("express");
const { processPayment, createPaymentIntent } = require("../controller/paymentController");

const router = express.Router();

// Route to process payment
router.post("/process", processPayment);

// Route to create a payment intent
router.post("/create-payment-intent", createPaymentIntent);

module.exports = router;