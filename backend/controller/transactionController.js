const Transaction = require("../modals/transactionModals");

// Get all transactions
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions", error });
    }
};

// Fetch all transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// Add a new transaction
const addTransaction = async (req, res) => {
    const { date, type, category, quantity, price, company, transactionType, description } = req.body;

    if (!date || !type || !category || !quantity || !price || !company || !transactionType || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newTransaction = new Transaction({ date, type, category, quantity, price, company, transactionType, description });
        await newTransaction.save();
        res.status(201).json({ message: "Transaction added successfully", newTransaction });
    } catch (error) {
        res.status(500).json({ message: "Error adding transaction", error });
    }
};

// Update a transaction
const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { date, type, category, quantity, price, company, transactionType, description } = req.body;

    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            id,
            { date, type, category, quantity, price, company, transactionType, description },
            { new: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction updated successfully", updatedTransaction });
    } catch (error) {
        res.status(500).json({ message: "Error updating transaction", error });
    }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(id);

        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction deleted successfully", deletedTransaction });
    } catch (error) {
        res.status(500).json({ message: "Error deleting transaction", error });
    }
};

module.exports = {
    getAllTransactions,
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
};
