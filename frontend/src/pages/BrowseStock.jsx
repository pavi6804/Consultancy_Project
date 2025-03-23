import React, { useState, useEffect } from "react";
import "./BrowseStock.css";
import {
  FaBox,
  FaRupeeSign,
  FaBoxes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSearch,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const BrowseStock = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockData, setStockData] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    quantity: 0,
    price: 0,
    description: "",
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showConfirm, setShowConfirm] = useState({ visible: false, action: null });

  const categories = [
    { name: "Men", color: "#3498db", icon: <FaBox /> },
    { name: "Women", color: "#fc23e0", icon: <FaBox /> },
    { name: "Kids", color: "#2ecc71", icon: <FaBox /> },
  ];

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/stock");
        setStockData(response.data);
      } catch (error) {
        toast.error("Failed to fetch stock data.");
      }
    };
    fetchStockData();
  }, []);

  const handleInputChange = (field, value) => {
    if (editingProduct) {
      setEditingProduct((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      setNewProduct((prev) => ({
        ...prev,
        [field]: value || "",
      }));
    }
  };

  const handleAddProduct = async () => {
    const { name, category, quantity, price, description } = newProduct;
    if (!name || !category || quantity < 0 || price < 0 || !description) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/stock", newProduct);
      setStockData([...stockData, response.data.newStockItem]);
      setNewProduct({ name: "", category: "", quantity: 0, price: 0, description: "" });
      setIsPopupOpen(false);
      toast.success("Product added successfully!");
    } catch (error) {
      toast.error("Failed to add product.");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product }); // Create a copy of the product to avoid direct mutation
  };

  const handleSaveProduct = async () => {
    try {
      // Validate the editingProduct object
      if (!editingProduct || !editingProduct._id) {
        console.error("Invalid editingProduct object:", editingProduct);
        toast.error("Invalid product data. Please try again.");
        return;
      }
  
      const { name, category, quantity, price, description } = editingProduct;
  
      // Validate required fields
      if (!name || !category || quantity < 0 || price < 0 || !description) {
        console.error("Validation failed for editingProduct:", editingProduct);
        toast.error("Please fill out all fields.");
        return;
      }
  
      // Make the API call to update the product
      const response = await axios.put(
        `http://localhost:3000/stock/${editingProduct._id}`,
        editingProduct
      );
  
      // Log the API response for debugging
      console.log("API response:", response.data);
  
      // Update the stockData state with the updated product
      setStockData((prev) =>
        prev.map((item) =>
          item._id === editingProduct._id ? response.data.updatedProduct : item
        )
      );
  
      // Clear the editingProduct state and show success message
      setEditingProduct(null);
      toast.success("Product updated successfully!");
    } catch (error) {
      // Log the error and show an error message
      console.error("Error in handleSaveProduct:", error);
      toast.error("Failed to update product. Please try again.");
    }
  };
  

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/stock/${productId}`);
      setStockData((prev) => prev.filter((item) => item._id !== productId));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Failed to delete product.");
      toast.error("Failed to delete product.");
    }
  };

  const confirmAction = () => {
    if (showConfirm.action) {
      showConfirm.action();
    }
    setShowConfirm({ visible: false, action: null });
  };

  const filteredStock = stockData.filter(
    (item) =>
      item && // Ensure the item is not undefined or null
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "" || item.category === selectedCategory)
  );

  useEffect(() => {
    console.log("Filtered stock data:", filteredStock); // Debugging log
  }, [filteredStock]);

  return (
    <ErrorBoundary>
      <div className="browse-stock-container">
        <ToastContainer />
        {showConfirm.visible && (
          <div className="confirm-modal">
            <div className="confirm-modal-content">
              <p>Are you sure you want to proceed?</p>
              <div className="confirm-modal-actions">
                <button onClick={confirmAction}>Yes</button>
                <button onClick={() => setShowConfirm({ visible: false, action: null })}>No</button>
              </div>
            </div>
          </div>
        )}
        <div><h2>Stock Inventory</h2></div>

        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for an item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="categories">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`category-box ${selectedCategory === category.name ? "active" : ""}`}
              style={{ borderColor: category.color }}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.name ? "" : category.name
                )
              }
            >
              {category.icon}
              <span>{category.name} Products</span>
            </div>
          ))}
        </div>

        <button className="add-product-btn" onClick={() => setIsPopupOpen(true)}>
          Add New Product
        </button>

        {isPopupOpen && (
          <div className="popup-overlay">
            <div className="popup-form">
              <h3>Add New Product</h3>
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <select
                value={newProduct.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={newProduct.quantity || ""}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price || ""}
                onChange={(e) => handleInputChange("price", e.target.value)}
              />
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
              <div className="popup-actions">
                <button onClick={handleAddProduct}>Add Product</button>
                <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="stock-grid">
          {filteredStock.length > 0 ? (
            filteredStock.map((stock, index) => (
              <div
                key={index}
                className={`stock-card ${stock.quantity < 10 ? "low-stock" : ""}`}
                data-category={stock.category}
                style={{
                  borderColor:
                    categories.find((cat) => cat.name === stock.category)?.color || "#000",
                }}
              >
                {editingProduct && editingProduct._id === stock._id ? (
                  <>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Product Name"
                    />
                    <select
                      value={editingProduct.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category, idx) => (
                        <option key={idx} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={editingProduct.quantity}
                      onChange={(e) => handleInputChange("quantity", e.target.value)}
                      placeholder="Quantity"
                    />
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="Price"
                    />
                    <textarea
                      value={editingProduct.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Description"
                    />
                    <div className="actions">
                      <button onClick={handleSaveProduct}>Save</button>
                      <button
                        className="cancel-btn"
                        onClick={() => setEditingProduct(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="item-name">{stock.name}</p>
                    <p><FaRupeeSign /> Price: ₹{stock.price}</p>
                    <p><FaBoxes /> Available: {stock.quantity}</p>
                    <p><strong>Category:</strong> {stock.category}</p>
                    <p className="status">
                      {stock.quantity < 10 ? <FaExclamationTriangle className="low-stock" /> : <FaCheckCircle className="in-stock" />}
                      {stock.quantity < 10 ? " Restock Needed" : " In Stock"}
                    </p>
                    <div className="actions">
                      <FaEdit
                        className="action-icon edit-icon"
                        onClick={() => handleEditProduct(stock)}
                      />
                      <FaTrashAlt
                        className="action-icon delete-icon"
                        onClick={() =>
                          setShowConfirm({
                            visible: true,
                            action: () => handleDeleteProduct(stock._id),
                          })
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="no-results">No items found.</p>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

// ErrorBoundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>Please try again later or contact support.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default BrowseStock;
