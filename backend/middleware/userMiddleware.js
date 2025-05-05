const jwt = require("jsonwebtoken");
const User = require("../modals/userModals");

// Middleware to verify user role
const verifyRole = (roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      req.user = user; // Attach user to the request object
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized", error: error.message });
    }
  };
};

module.exports = { verifyRole };