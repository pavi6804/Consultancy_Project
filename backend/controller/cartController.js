const Cart = require("../modals/cartModals");
const Stock = require("../modals/stockModals");
const mongoose = require("mongoose");

// Add item to cart
const addToCart = async (req, res) => {
  const { userId, stockId, quantity } = req.body;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  if (!stockId || !mongoose.Types.ObjectId.isValid(stockId)) {
    return res.status(400).json({ error: "Invalid stockId" });
  }

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "Quantity must be greater than 0" });
  }

  try {
    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ error: "Stock item not found" });
    }

    if (stock.quantity === 0) {
      return res.status(400).json({ error: `${stock.name} is out of stock.` });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      // Create a new cart if it doesn't exist
      const newCart = new Cart({
        userId,
        items: [{ stockId, quantity }],
      });
      await newCart.save();
    } else {
      // Check if the item is already in the cart
      const existingItem = cart.items.find(
        (item) => item.stockId.toString() === stockId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ stockId, quantity });
      }

      await cart.save();
    }

    // Decrease stock quantity
    stock.quantity -= quantity;
    await stock.save();

    res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};


// Get cart details
const getCart = async (req, res) => {
  const { userId } = req.params;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    let cart = await Cart.findOne({ userId }).populate("items.stockId");

    // 🔧 If cart doesn't exist, create an empty one
    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch cart details" });
  }
};


const updateCartItemQuantity = async (req, res) => {
  const { userId, stockId } = req.params;
  const { quantityChange } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(stockId)) {
      return res.status(400).json({ error: "Invalid userId or stockId" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const item = cart.items.find((item) => item.stockId.toString() === stockId);
    if (!item) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ error: "Stock item not found" });
    }

    // Validate stock availability
    const newQuantity = item.quantity + quantityChange;
    if (newQuantity > stock.quantity) {
      return res.status(400).json({
        error: `Requested quantity exceeds available stock (${stock.quantity}).`,
      });
    }

    if (newQuantity <= 0) {
      // Remove item if quantity becomes 0 or less
      cart.items = cart.items.filter((item) => item.stockId.toString() !== stockId);
    } else {
      // Update item quantity
      item.quantity = newQuantity;
    }

    // Update total price
    cart.totalPrice = cart.items.reduce((total, item) => {
      const itemStock = stock._id.toString() === item.stockId.toString() ? stock : null;
      return total + (itemStock ? itemStock.price * item.quantity : 0);
    }, 0);

    // Update stock quantity
    stock.quantity -= quantityChange;
    await stock.save();
    await cart.save();

    res.status(200).json({ message: "Quantity updated successfully", cart });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ error: "Failed to update quantity" });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Restore stock quantities
    for (const item of cart.items) {
      const stock = await Stock.findById(item.stockId);
      if (stock) {
        stock.quantity += item.quantity;
        await stock.save();
      }
    }

    await Cart.findOneAndDelete({ userId });

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};

// Remove a single item from the cart
const removeItemFromCart = async (req, res) => {
  const { userId, stockId } = req.params;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  if (!stockId || !mongoose.Types.ObjectId.isValid(stockId)) {
    return res.status(400).json({ message: "Invalid stockId" });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.stockId.toString() === stockId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const item = cart.items[itemIndex];
    const stock = await Stock.findById(stockId);

    // Restore stock quantity
    if (stock) {
      stock.quantity += item.quantity;
      await stock.save();
    }

    // Update total price
    cart.totalPrice -= stock.price * item.quantity;

    // Remove item from cart
    cart.items.splice(itemIndex, 1);

    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};


module.exports = { addToCart, getCart, clearCart, removeItemFromCart, updateCartItemQuantity };
