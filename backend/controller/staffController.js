const Staff = require("../modals/staffModals");

// filepath: d:\Senthil-Textiles\backend\controller\staffController.js

// Get all staff members
const getAllStaff = async (req, res) => {
    try {
        const staffMembers = await Staff.find().select("-__v"); // Exclude the __v field
        res.status(200).json(staffMembers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching staff members", error });
    }
};

// Get a single staff member by ID
const getStaffById = async (req, res) => {
    try {
        const staffMember = await Staff.findById(req.params.id);
        if (!staffMember) {
            return res.status(404).json({ message: "Staff member not found" });
        }
        res.status(200).json(staffMember);
    } catch (error) {
        res.status(500).json({ message: "Error fetching staff member", error });
    }
};

// Create a new staff member
const createStaff = async (req, res) => {
    try {
        const newStaff = new Staff(req.body);
        const savedStaff = await newStaff.save();
        res.status(201).json(savedStaff);
    } catch (error) {
        res.status(400).json({ message: "Error creating staff member", error });
    }
};

// Update a staff member by ID
const updateStaff = async (req, res) => {
    try {
        const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
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
};

// Delete a staff member by ID
const deleteStaff = async (req, res) => {
    try {
        const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
        if (!deletedStaff) {
            return res.status(404).json({ message: "Staff member not found" });
        }
        res.status(200).json({ message: "Staff member deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting staff member", error });
    }
};

module.exports = {
    getAllStaff,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaff,
};