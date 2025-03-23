const Stock = require("../modals/stockModals");

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

module.exports = {
    getAllStock,
    addStockItem,
    updateStockItem,
    deleteStockItem,
};