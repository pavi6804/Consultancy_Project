const express = require("express");
const {
    getAllTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactions,
} = require("../controller/transactionController");

const router = express.Router();

// Route to get all transactions
router.get("/", getAllTransactions);

// Route to add a new transaction
router.post("/", addTransaction);

// Route to update a transaction by ID
router.put("/:id", updateTransaction);

// Route to delete a transaction by ID
router.delete("/:id", deleteTransaction);

// Route to fetch transactions
router.get("/transactions", getTransactions);

module.exports = router;
