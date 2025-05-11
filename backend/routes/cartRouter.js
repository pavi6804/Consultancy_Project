const express = require("express");
const { addToCart, getCart, clearCart, removeItemFromCart, updateCartItemQuantity } = require("../controller/cartController");
const router = express.Router();

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.delete("/:userId", clearCart);
router.delete("/remove/:userId/:stockId", removeItemFromCart);
router.put("/update-quantity/:userId/:stockId", updateCartItemQuantity);



module.exports = router;