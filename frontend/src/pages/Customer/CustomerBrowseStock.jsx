import React, { useState, useEffect } from "react";
import { Card, Button, Input, Spin } from "antd";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CustomerBrowseStock.css";
import { API } from "../../utils/api.js"; // Adjust the import based on your project structure  

const CustomerBrowseStock = ({ userId }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get(`${ API }stock`);
        console.log("Stocks API response:", response.data); // Debugging log
        setStocks(Array.isArray(response.data) ? response.data : []); // Ensure stocks is an array
      } catch (error) {
        console.error("Error fetching stocks:", error);
        toast.error("Failed to load stocks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCartCount = async () => {
      if (!userId) {
        console.error("User ID is undefined. Cannot fetch cart count.");
        return;
      }

      try {
        const response = await axios.get(`${ API }cart/${userId}`);
        const cartItems = response.data.items || [];
        setCartCount(cartItems.length);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchStocks();
    fetchCartCount();
  }, [userId]);

  const addToCart = async (stock) => {
    if (!userId) {
      toast.error("User not logged in. Please log in to add items to the cart.");
      return;
    }

    try {
      const response = await axios.get(`${ API }cart/${userId}`);
      const cartItems = response.data.items || [];
      const isItemInCart = cartItems.some((item) => item.stockId === stock._id);

      if (isItemInCart) {
        toast.warning(`${stock.name} is already in your cart!`);
      } else {
        await axios.post(`${ API }cart/add`, {
          userId,
          stockId: stock._id,
          quantity: 1,
        });
        setCartCount((prevCount) => prevCount + 1);
        toast.success(`${stock.name} added to your cart!`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.message || "Failed to add item to cart.");
    }
  };

  const filteredStocks = Array.isArray(stocks)
    ? stocks.filter((stock) =>
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="browse-stock-container">
      <ToastContainer />
      <h1 className="stock-title">Browse Stock</h1>
      <div className="search-bar">
        <Input
          placeholder="Search stock..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      {loading ? (
        <div className="loading-spinner">
          <Spin size="large" />
        </div>
      ) : (
        <div className="stock-grid">
          {filteredStocks.length === 0 ? (
            <p className="no-results">No stocks found.</p>
          ) : (
            filteredStocks.map((stock) => (
              <Card key={stock._id} className="stock-card">
                <h3>{stock.name}</h3>
                <p>Price: ${stock.price}</p>
                <p>Category: {stock.category}</p>
                <p>Quantity: {stock.quantity}</p>
                <Button
                  type="primary"
                  onClick={() => addToCart(stock)}
                >
                  Add to Cart
                </Button>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerBrowseStock;