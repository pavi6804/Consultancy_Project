import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { API } from "../../utils/api.js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Payment.css";

const stripePromise = loadStripe("pk_test_51RNWSpR1hHyJZ4kXgXNlR89KXAjQuW1F2aeUnzUAZfyybfHSvnZjFmp8nDnaxgCyKnGTVAeLvhxUT6mO87FmZYAL00or7E2I3e");

const Payment = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  const customerName = localStorage.getItem("customerName") || "Customer";
  const customerEmail = localStorage.getItem("customerEmail") || "unknown";
  const address = localStorage.getItem("address") || "";
  const phoneNumber = localStorage.getItem("phoneNumber") || "";
  const userId = localStorage.getItem("userId");

  // Fetch cart from backend for up-to-date info
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get(`${API}cart/${userId}`);
        setCart(data.items || []);
      } catch (err) {
        setCart([]);
        toast.error("Failed to load cart.", { position: "top-center" });
      } finally {
        setLoadingCart(false);
      }
    };
    fetchCart();
  }, [userId]);

  // Calculate total
  const total = cart.reduce(
    (sum, item) =>
      sum +
      ((item.stockId?.price || 0) * (item.quantity || 1)),
    0
  );

  // Send order confirmation emails to customer and admin
  const sendOrderConfirmationEmails = async (status, paymentId = null) => {
    try {
      // Email to customer
      await axios.post(`${API}send-email`, {
        to: customerEmail,
        subject: "Order Confirmation",
        body: `
          Dear ${customerName},<br/>
          Thank you for your order.<br/>
          Status: ${status}<br/>
          Payment ID: ${paymentId || "N/A"}<br/>
          Amount: ₹${total}<br/>
          We will process your order soon.
        `,
      });

      // Email to admin (replace with your admin email)
      await axios.post(`${API}send-email`, {
        to: "admin@example.com",
        subject: "New Order Placed",
        body: `
          New order placed by ${customerName} (${customerEmail})
          Status: ${status}
          Amount: ₹${total}
          Address: ${address}
          Phone: ${phoneNumber}
        `,
      });
    } catch (err) {
      console.error("Failed to send order confirmation emails:", err);
    }
  };

  const placeOrder = async (status, paymentId = null) => {
    try {
      await axios.post(`${API}orders/place`, {
        userId,
        address,
        phoneNumber,
        paymentStatus: status,
        paymentId,
      });
    } catch (err) {
      console.error("Failed to store order in DB:", err);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!address || !phoneNumber) {
      toast.error("Please provide your address and phone number.", { position: "top-center" });
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty.", { position: "top-center" });
      return;
    }

    if (paymentMethod === "cod") {
      setIsProcessing(true);
      try {
        await placeOrder("Success (COD)");
        await sendOrderConfirmationEmails("Success (COD)");
        toast.success("Order placed successfully with Cash on Delivery!", {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/order-history");
        }, 2000);
      } catch (err) {
        toast.error("Failed to place order. Please try again.", {
          position: "top-center",
        });
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (!stripe || !elements) {
      toast.error("Stripe is not loaded yet. Please try again.", {
        position: "top-center",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { data } = await axios.post(`${API}payment/create-payment-intent`, {
        amount: total * 100,
      });

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        toast.error("Card details are missing. Please enter your card information.", {
          position: "top-center",
        });
        setIsProcessing(false);
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerName,
            email: customerEmail,
          },
        },
      });

      if (error) {
        toast.error(`Payment failed: ${error.message}`, {
          position: "top-center",
          autoClose: 4000,
        });
        await placeOrder("Failed");
      } else if (paymentIntent.status === "succeeded") {
        await placeOrder("Success (Card)", paymentIntent.id);
        await sendOrderConfirmationEmails("Success (Card)", paymentIntent.id);
        toast.success("Payment successful! Order placed successfully!", {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/order-history");
        }, 2000);
      }
    } catch (err) {
      toast.error("An error occurred while processing your payment. Please try again.", {
        position: "top-center",
        autoClose: 4000,
      });
      await placeOrder("Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loadingCart) {
    return <div>Loading cart...</div>;
  }

  return (
    <div className="payment-container">
      <ToastContainer />
      <div className="payment-card">
        <h2 className="payment-title">Payment</h2>
        <div className="payment-method-section">
          <label className="payment-method-label">Select Payment Method</label>
          <div className="payment-method-options">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="payment-method-radio"
              />
              <span className="payment-method-text">Credit/Debit Card</span>
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="payment-method-radio"
              />
              <span className="payment-method-text">Cash on Delivery</span>
            </label>
          </div>
        </div>
        <div className="cart-total" style={{ textAlign: "right", fontWeight: "bold", margin: "16px 0" }}>
          Total: ₹{total}
        </div>

        {paymentMethod === "card" && (
          <form onSubmit={handlePayment} autoComplete="off">
            {/* Dummy hidden input to prevent autofill */}
            <input type="text" name="hidden" style={{ display: "none" }} autoComplete="off" />

            <div className="card-element-elite">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#22223b",
                      backgroundColor: "#f7faff",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#fa755a",
                      iconColor: "#fa755a",
                    },
                  },
                }}
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="payment-btn"
            >
              {isProcessing ? "Processing..." : `Pay ₹${total}`}
            </button>
          </form>
        )}

        {paymentMethod === "cod" && (
          <button
            onClick={handlePayment}
            className="payment-btn"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Place Order (Cash on Delivery)"}
          </button>
        )}
      </div>
    </div>
  );
};

const PaymentPage = () => (
  <Elements stripe={stripePromise}>
    <Payment />
  </Elements>
);

export default PaymentPage;