const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const processPayment = async (req, res) => {
    const { userId, amount, paymentMethod } = req.body;
  
    if (!userId || !amount || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      // Simulate payment processing logic
      // You can integrate with a payment gateway like Stripe, PayPal, etc.
      console.log(`Processing payment of $${amount} for user ${userId} using ${paymentMethod}`);
      res.status(200).json({ message: "Payment processed successfully" });
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ message: "Error processing payment", error });
    }
  };

const createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ message: "Amount is required" });
  }

  try {
    // Create a PaymentIntent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      payment_method_types: ["card"],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: "Error creating payment intent", error });
  }
};

module.exports = { processPayment, createPaymentIntent };