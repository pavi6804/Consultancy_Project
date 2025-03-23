const express = require("express");
const cors = require("cors");
const stockRoutes = require("./routes/stockRoutes");
const transactionRoutes = require("./routes/transactionRoutes"); // Import transaction routes

const app = express();

app.use(cors());
app.use(express.json());

// Register routes
app.use("/stock", stockRoutes);
app.use("/transactions", transactionRoutes); // Register transaction routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
