const Stock = require("../modals/stockModals");
const nodemailer = require("nodemailer");
require('dotenv').config();

// Get all stock items
const getAllStock = async (req, res) => {
    try {
        const stockItems = await Stock.find();
        res.status(200).json(stockItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stock items", error });
    }
};

// Add a new stock item
const addStockItem = async (req, res) => {
    const { name, price, quantity, category, description } = req.body;

    if (!name || !price || !quantity || !category || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }

     // Trigger low stock alert
     await checkLowStockAndAlert();

    try {
        const newStockItem = new Stock({ name, price, quantity, category, description });
        await newStockItem.save();
        res.status(201).json({ message: "Stock item added successfully", newStockItem });
    } catch (error) {
        res.status(500).json({ message: "Error adding stock item", error });
    }
};

// Update a stock item
const updateStockItem = async (req, res) => {
    const { id } = req.params;
    const { name, price, quantity, category, description } = req.body;

    try {
        const updatedStockItem = await Stock.findByIdAndUpdate(
            id,
            { name, price, quantity, category, description },
            { new: true }
        );

        // Trigger low stock alert
        await checkLowStockAndAlert();

        if (!updatedStockItem) {
            return res.status(404).json({ message: "Stock item not found" });
        }

        res.status(200).json({ message: "Stock item updated successfully", updatedStockItem });
    } catch (error) {
        res.status(500).json({ message: "Error updating stock item", error });
    }
};

// Delete a stock item
const deleteStockItem = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedStockItem = await Stock.findByIdAndDelete(id);

        if (!deletedStockItem) {
            return res.status(404).json({ message: "Stock item not found" });
        }

        res.status(200).json({ message: "Stock item deleted successfully", deletedStockItem });
    } catch (error) {
        res.status(500).json({ message: "Error deleting stock item", error });
    }
};

const checkLowStockAndAlert = async () => {
  try {
    // Define the low stock threshold
    const LOW_STOCK_THRESHOLD = 5;

    // Fetch all stock items with quantity below the threshold
    const lowStockItems = await Stock.find({ quantity: { $lt: LOW_STOCK_THRESHOLD } });

    if (lowStockItems.length > 0) {
      // Configure the email transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.email, // Replace with your email
          pass: process.env.password, // Replace with your app password
        },
      });

      // Prepare the email content
      const emailBody = lowStockItems
        .map((item) => `Product: ${item.name}, Quantity: ${item.quantity}`)
        .join("\n");

      const mailOptions = {
        from: process.env.email, // Sender's email
        to: process.env.email, // Replace with the admin's email
        subject: "Low Stock Alert",
        text: `The following items have low stock:\n\n${emailBody}`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      console.log("Low stock alert email sent successfully!");
    }
  } catch (error) {
    console.error("Error sending low stock alert email:", error);
  }
};

module.exports = {
    getAllStock,
    addStockItem,
    updateStockItem,
    deleteStockItem,
    checkLowStockAndAlert 
};