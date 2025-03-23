const express = require("express");

const {
    getAllStock,
    addStockItem,
    updateStockItem,
    deleteStockItem,
} = require("../controller/stockController");

const router = express.Router();

// Route to get all stock items
router.get("/", getAllStock);

// Route to add a new stock item
router.post("/", addStockItem);

// Route to update a stock item by ID
router.put("/:id", updateStockItem);

// Route to delete a stock item by ID
router.delete("/:id", deleteStockItem);

module.exports = router;