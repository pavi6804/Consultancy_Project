import React, { useState, useEffect } from "react";
import "./StaffDetails.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import {
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import { API } from "../../utils/api.js"; // Correct for default export

const StaffDetails = () => {
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({ id: "", name: "", role: "", email: "", phone: "", address: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState(null); // Track the ID of the staff to delete

  // Fetch staff data from backend
  useEffect(() => {
    axios.get(`${ API }staff`)
      .then((response) => setStaffList(Array.isArray(response.data) ? response.data : []))
      .catch((error) => console.error("Error fetching staff data:", error));
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission (Add/Edit Staff)
  const handleSubmit = (e) => {
    e.preventDefault();
    const { id, ...data } = formData; // Exclude the `id` field for backend compatibility
    if (isEditing) {
      if (!id) {
        console.error("Error: Missing staff ID for update.");
        return;
      }
      axios
        .put(`${ API }staff/${id}`, data, { headers: { "Content-Type": "application/json" } })
        .then((response) => {
          setStaffList(staffList.map((staff) => (staff._id === id ? response.data : staff)));
          setIsEditing(false);
          toast.success("Staff updated successfully!"); // Toastify success message
        })
        .catch((error) => console.error("Error updating staff:", error));
    } else {
      axios
        .post("${ API }staff", data, { headers: { "Content-Type": "application/json" } })
        .then((response) => {
          setStaffList([...staffList, response.data]);
          toast.success("Staff added successfully!"); // Toastify success message
        })
        .catch((error) => console.error("Error adding staff:", error));
    }
    setFormData({ id: "", name: "", role: "", email: "", phone: "", address: "" });
  };

  // Handle Edit
  const handleEdit = (staff) => {
    setFormData({
      id: staff._id, // Use `_id` from the backend response
      name: staff.name,
      role: staff.role,
      email: staff.email,
      phone: staff.phone,
      address: staff.address,
    });
    setIsEditing(true);
  };

  // Handle Delete
  const handleDelete = async () => {
    try {
      await axios.delete(`${ API }staff/${deleteId}`);
      setStaffList(staffList.filter((staff) => staff._id !== deleteId));
      toast.success("Staff deleted successfully!");
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error("Failed to delete staff.");
    } finally {
      setDeleteId(null); // Close the confirmation modal
    }
  };

  return (
    <div className="staff-container">
      <ToastContainer /> {/* Add ToastContainer to render toast notifications */}
      <h2 className="title">Staff Management</h2>

      {deleteId !== null && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this staff member?</p>
            <div className="modal-actions">
              <button onClick={handleDelete}>Yes</button>
              <button onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Form */}
      <form className="staff-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Staff Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="role" placeholder="Role" value={formData.role} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <button type="submit">{isEditing ? "Update Staff" : "Add Staff"}</button>
      </form>

      {/* Staff Table */}
      <table className="staff-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff, index) => (
            <tr key={staff._id || index}> {/* Use `_id` as the unique key */}
              <td>{staff.name}</td>
              <td>{staff.role}</td>
              <td>{staff.email}</td>
              <td>{staff.phone}</td>
              <td>{staff.address}</td>
              <td>
                <div className="actions">
                  <FaEdit
                    className="action-icon edit-icon"
                    onClick={() => handleEdit(staff)}
                  />
                  <FaTrashAlt
                    className="action-icon delete-icon"
                    onClick={() => setDeleteId(staff._id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffDetails;
