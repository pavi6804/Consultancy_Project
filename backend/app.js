const express = require('express');
const staffRoutes = require('./routes/staffRoutes');
const cors = require("cors");
const connectDB = require('./config/db'); // Import the database connection
const stockRoutes = require('./routes/stockRoutes'); // Import stock-related routes
const emailRouter = require("./routes/emailRouter"); // Import email-related routes
const transactionRoutes = require('./routes/transactionRoutes'); // Import transaction-related routes
const userRoutes = require("./routes/userRoute");
const cartRoutes = require("./routes/cartRouter"); // Import cart-related routes
const orderRoutes = require("./routes/orderRouter"); // Import order-related routes
const paymentRouter = require("./routes/paymentRouter"); // Import payment-related routes

const app = express();

// Connect to the database
connectDB();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use(cors({ origin: "http://localhost:5173" })); // Allow requests from the frontend
app.use(express.json()); // Parse JSON request bodies
app.use("/users", userRoutes); 
app.use("/send-email", emailRouter);
app.use('/staff', staffRoutes); // Route for staff-related API endpoints
app.use('/stock', stockRoutes); // Route for stock-related API endpoints
app.use('/transactions', transactionRoutes); // Route for transaction-related API endpoints
app.use('/cart', cartRoutes); // Route for cart-related API endpoints
app.use('/orders', orderRoutes); // Route for order-related API endpoints
app.use('/payment', paymentRouter);

module.exports = app; // Export the app for testing purposes