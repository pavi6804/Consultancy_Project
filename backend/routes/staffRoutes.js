const express = require("express");
const Staff = require("../modals/staffModals");

const router = express.Router();

// Get all staff members
router.get("/", async (req, res) => {
    try {
        const staffMembers = await Staff.find();
        res.status(200).json(staffMembers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching staff members", error });
    }
});

// Get a single staff member by ID
router.get("/:id", async (req, res) => {
    try {
        const staffMember = await Staff.findById(req.params.id);
        if (!staffMember) {
            return res.status(404).json({ message: "Staff member not found" });
        }
        res.status(200).json(staffMember);
    } catch (error) {
        res.status(500).json({ message: "Error fetching staff member", error });
    }
});

// Create a new staff member
router.post("/", async (req, res) => {
    try {
        const { _id, ...data } = req.body; // Exclude `_id` from the request body
        const { name, role, email, phone, address } = data;

        // Validate required fields
        if (!name || !role || !email || !phone || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newStaff = new Staff(data);
        const savedStaff = await newStaff.save();
        res.status(201).json(savedStaff);
    } catch (error) {
        res.status(400).json({ message: "Error creating staff member", error });
    }
});

// Update a staff member by ID
router.put("/:id", async (req, res) => {
    try {
        const { _id, ...data } = req.body; // Exclude `_id` from the request body
        const { name, role, email, phone, address } = data;

        // Validate required fields
        if (!name || !role || !email || !phone || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, data, {
            new: true,
            runValidators: true,
        });
        if (!updatedStaff) {
            return res.status(404).json({ message: "Staff member not found" });
        }
        res.status(200).json(updatedStaff);
    } catch (error) {
        res.status(400).json({ message: "Error updating staff member", error });
    }
});

// Delete a staff member by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
        if (!deletedStaff) {
            return res.status(404).json({ message: "Staff member not found" });
        }
        res.status(200).json({ message: "Staff member deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting staff member", error });
    }
});

module.exports = router;