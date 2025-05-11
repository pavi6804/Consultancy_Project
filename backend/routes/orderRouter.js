const express = require("express");
const { placeOrder, getOrders } = require("../controller/orderController");
const router = express.Router();

router.post("/place", placeOrder);
router.get("/:userId", getOrders);

module.exports = router;