import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Ensure ToastContainer is imported
import "react-toastify/dist/ReactToastify.css";

import "./PurchaseSales.css"; // Import the CSS file

const PurchaseSales = () => {
  const [transactions, setTransactions] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    type: "",
    category: "",
    quantity: 1,
    price: 100,
    company: "",
    transactionType: "Purchase",
    description: "",
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null); // Track the index of the transaction to delete

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/stock");
        setStockData(response.data);
      } catch (error) {
        console.error("Failed to fetch stock data.");
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/transactions");
        setTransactions(response.data);
      } catch (error) {
        console.error("Failed to fetch transactions.");
      }
    };

    fetchStockData();
    fetchTransactions();
  }, []);

  const handleInputChange = (field, value) => {
    setNewTransaction((prev) => ({
      ...prev,
      [field]: value || "", // Default to an empty string for text fields
    }));
  };

  const updateStockQuantity = async (stockItem, quantityChange) => {
    try {
      await axios.put(`http://localhost:3000/stock/${stockItem._id}`, {
        ...stockItem,
        quantity: stockItem.quantity + quantityChange,
      });
      const updatedStockData = stockData.map((item) =>
        item._id === stockItem._id
          ? { ...item, quantity: item.quantity + quantityChange }
          : item
      );
      setStockData(updatedStockData);
    } catch (error) {
      console.error("Failed to update stock quantity.");
    }
  };

  const handleAddOrUpdateTransaction = async () => {
    // Validate all fields
    const { date, type, category, quantity, price, company, transactionType, description } = newTransaction;
    if (!date || !type || !category || !quantity || !price || !company || !transactionType || !description) {
      alert("Please fill all fields.");
      return;
    }

    const stockItem = stockData.find(
      (item) => item.name === type && item.category === category
    );

    if (!stockItem) {
      alert("Stock item not found.");
      return;
    }

    const quantityChange =
      transactionType === "Purchase" ? parseInt(quantity) : -parseInt(quantity);

    if (stockItem.quantity + quantityChange < 0) {
      alert("Insufficient stock for this transaction.");
      return;
    }

    try {
      if (editingIndex !== null) {
        const oldTransaction = transactions[editingIndex];
        const oldQuantityChange =
          oldTransaction.transactionType === "Purchase"
            ? -oldTransaction.quantity
            : oldTransaction.quantity;

        await updateStockQuantity(stockItem, oldQuantityChange + quantityChange);

        const transactionId = transactions[editingIndex]._id;
        const response = await axios.put(`http://localhost:3000/transactions/${transactionId}`, newTransaction);
        const updatedTransactions = [...transactions];
        updatedTransactions[editingIndex] = response.data.updatedTransaction;
        setTransactions(updatedTransactions);
        toast.success("Transaction updated successfully!"); // Toastify success message
      } else {
        await updateStockQuantity(stockItem, quantityChange);

        try {
          const response = await axios.post("http://localhost:3000/transactions", newTransaction);
          setTransactions([...transactions, response.data.newTransaction]);
          toast.success("Transaction added successfully!"); // Toastify success message
        } catch (error) {
          console.error("Failed to add new transaction:", error.response || error.message);
          alert("Failed to add new transaction. Please check the server endpoint or payload.");
          return;
        }
      }

      setNewTransaction({
        date: "",
        type: "",
        category: "",
        quantity: 1,
        price: 100,
        company: "",
        transactionType: "Purchase",
        description: "",
      });
      setEditingIndex(null);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to update stock or transaction.");
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Format as yyyy-MM-dd
  };

  const formatDateForDisplay = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDeleteTransaction = async () => {
    const transaction = transactions[deleteIndex];
    const stockItem = stockData.find(
      (item) => item.name === transaction.type && item.category === transaction.category
    );

    if (!stockItem) {
      toast.error("Stock item not found.");
      setDeleteIndex(null); // Close the confirmation modal
      return;
    }

    const quantityChange =
      transaction.transactionType === "Purchase"
        ? -transaction.quantity
        : transaction.quantity;

    try {
      await updateStockQuantity(stockItem, quantityChange);

      const transactionId = transaction._id;
      await axios.delete(`http://localhost:3000/transactions/${transactionId}`);
      setTransactions(transactions.filter((_, i) => i !== deleteIndex));
      toast.success("Transaction deleted successfully!"); // Toastify success message
    } catch (error) {
      console.error("Failed to delete transaction.");
      toast.error("Failed to delete transaction.");
    } finally {
      setDeleteIndex(null); // Close the confirmation modal
    }
  };

  const handleEditTransaction = (index) => {
    const transactionToEdit = transactions[index];
    setEditingIndex(index);
    setNewTransaction({
      ...transactionToEdit,
      date: formatDate(transactionToEdit.date), // Format date for input
    });
    setShowForm(true); // Open the form for editing
  };

  return (
    <div className="container">
      <ToastContainer /> {/* Add ToastContainer here */}
      <h2>📦 Purchase & Sales Management</h2>

      <button className="add-btn" onClick={() => setShowForm(true)}>➕ Add Transaction</button>

      {showForm && (
        <div className="form-container">
          <h3>{editingIndex !== null ? "✏️ Edit Transaction" : "➕ Add New Transaction"}</h3>
          <div className="form">
            <label>Date:</label>
            <input type="date" value={newTransaction.date} onChange={(e) => handleInputChange("date", e.target.value)} />
            
            <label>Transaction Type:</label>
            <select value={newTransaction.transactionType} onChange={(e) => handleInputChange("transactionType", e.target.value)}>
              <option value="Purchase">Purchase</option>
              <option value="Sale">Sale</option>
            </select>

            <label>Item:</label>
            <select
              value={newTransaction.type}
              onChange={(e) => {
                const selectedItem = stockData.find((item) => item.name === e.target.value);
                setNewTransaction({
                  ...newTransaction,
                  type: e.target.value,
                  category: selectedItem ? selectedItem.category : "",
                  price: selectedItem ? selectedItem.price : 100, // Set default price from stock item
                });
              }}
            >
              <option value="">Select Item</option>
              {stockData.map((item) => (
                <option key={item._id} value={item.name}>{item.name}</option>
              ))}
            </select>

            <label>Category:</label>
            <input type="text" value={newTransaction.category || ""} readOnly placeholder="Category" />

            <label>Quantity:</label>
            <input type="number" value={newTransaction.quantity || ""} onChange={(e) => handleInputChange("quantity", e.target.value)} placeholder="Quantity" />

            <label>Price:</label>
            <input type="number" value={newTransaction.price || ""} onChange={(e) => handleInputChange("price", e.target.value)} placeholder="Price" />

            <label>Company:</label>
            <input type="text" value={newTransaction.company} onChange={(e) => handleInputChange("company", e.target.value)} placeholder="Company Name" />

            <label>Description:</label>
            <textarea value={newTransaction.description} onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Enter description"></textarea>

            <button onClick={handleAddOrUpdateTransaction}>
              {editingIndex !== null ? "Save" : "Add"}
            </button>
            <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {deleteIndex !== null && (
        <div className="confirmation-modal">
          <div className="confirm-modal-content">
            <p>Are you sure you want to delete this transaction?</p>
            <div className="confirm-modal-actions">
              <button onClick={handleDeleteTransaction}>Yes</button>
              <button onClick={() => setDeleteIndex(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction Type</th>
              <th>Item</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Company</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{formatDateForDisplay(transaction.date)}</td>
                  <td>{transaction.transactionType}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.quantity}</td>
                  <td>₹{transaction.price}</td>
                  <td>{transaction.company}</td>
                  <td>{transaction.description}</td>
                  <td>
                    <button onClick={() => handleEditTransaction(index)}>Edit</button>
                    <button className="delete-btn" onClick={() => setDeleteIndex(index)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="9" className="no-data">No transactions found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseSales;
