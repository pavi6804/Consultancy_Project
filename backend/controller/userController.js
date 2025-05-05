const User = require("../modals/userModals"); // Import the User model
const Staff = require("../modals/staffModals"); // Import the Staff model
const jwt = require("jsonwebtoken"); // Import JWT for token generation

// Register User
const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // If the role is "staff", validate the email and name from the staff details
    if (role === "staff") {
      const staff = await Staff.findOne({
        email: { $regex: new RegExp(`^${email}$`, "i") },
        name: { $regex: new RegExp(`^${username}$`, "i") }, // Use "name" instead of "username"
      });

      console.log("Staff Query Result:", staff);

      if (!staff) {
        return res.status(400).json({
          message: "Invalid staff details. Email or name does not match staff records.",
        });
      }
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const user = await User.create({ username, email, password, role });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the entered password with the hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

module.exports = { registerUser, loginUser }; // Export the functions