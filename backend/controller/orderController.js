const Order = require("../modals/orderModals");
const Cart = require("../modals/cartModals");
const mongoose = require("mongoose");

// Place a new order
const placeOrder = async (req, res) => {
  const { userId, address, phoneNumber } = req.body;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  try {
    const cart = await Cart.findOne({ userId }).populate("items.stockId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Create a new order
    const order = new Order({
      userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      address,
      phoneNumber,
      paymentStatus: "Pending",
    });
    await order.save();

    // Clear the cart
    await Cart.findOneAndDelete({ userId });

    res.status(200).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
};

// Get all orders for a user
const getOrders = async (req, res) => {
  const { userId } = req.params;

  console.log("Request Body:", req.body);

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    const orders = await Order.find({ userId }).populate("items.stockId");
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found for this user" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

module.exports = { placeOrder, getOrders };