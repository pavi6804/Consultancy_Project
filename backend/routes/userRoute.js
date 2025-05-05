const express = require("express");
const { registerUser, loginUser } = require("../controller/userController");
const { verifyRole } = require("../middleware/userMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin-only route
router.get("/admin-data", verifyRole(["admin"]), (req, res) => {
  res.status(200).json({ message: "Welcome, Admin! This is admin-only data." });
});

// Staff-only route
router.get("/staff-data", verifyRole(["staff", "admin"]), (req, res) => {
  res.status(200).json({ message: "Welcome, Staff! This is staff data." });
});

// Customer-only route
router.get("/customer-data", verifyRole(["customer", "admin"]), (req, res) => {
  res.status(200).json({ message: "Welcome, Customer! This is customer data." });
});

module.exports = router;