const express = require('express');
const staffRoutes = require('./routes/staffRoutes');
const cors = require("cors");
const connectDB = require('./config/db'); // Import the database connection
const stockRoutes = require('./routes/stockRoutes'); // Import stock-related routes
const transactionRoutes = require('./routes/transactionRoutes'); // Import transaction-related routes
const userRoutes = require("./routes/userRoute");

const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use(cors({ origin: "http://localhost:5173" })); // Allow requests from the frontend
app.use(express.json()); // Parse JSON request bodies
app.use("/users", userRoutes); 
app.use('/staff', staffRoutes); // Route for staff-related API endpoints
app.use('/stock', stockRoutes); // Route for stock-related API endpoints
app.use('/transactions', transactionRoutes); // Route for transaction-related API endpoints

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
