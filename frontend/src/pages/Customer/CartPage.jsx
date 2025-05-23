import React, { useState, useEffect } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../utils/api.js";
import "./CartPage.css";

const CartPage = ({ userId }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      message.error("User ID is null. Cannot fetch cart.");
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await axios.get(`${API}cart/${userId}`);
        setCart(response.data.items);
      } catch (error) {
        console.error("Error fetching cart:", error);
        message.error(
          error.response?.data?.message ||
            "Failed to load cart. Please try again later."
        );
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  const removeFromCart = async (stockId) => {
    try {
      await axios.delete(`${API}cart/remove/${userId}/${stockId}`);
      setCart((prevCart) =>
        prevCart.filter((item) => item.stockId._id !== stockId)
      );
      message.success("Item removed from cart!");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      message.error(
        error.response?.data?.message || "Failed to remove item from cart."
      );
    }
  };

  const updateQuantity = async (stockId, change) => {
    try {
      await axios.put(
        `${API}cart/update-quantity/${userId}/${stockId}`,
        { quantityChange: change }
      );
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.stockId._id === stockId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
      );
      message.success("Quantity updated!");
    } catch (error) {
      console.error("Error updating quantity:", error);
      message.error(
        error.response?.data?.message || "Failed to update quantity."
      );
    }
  };

  const proceedToCheckout = () => {
    try {
      message.success("Proceeding to checkout...");
      navigate("/checkout");
    } catch (error) {
      console.error("Error proceeding to checkout:", error);
      message.error("Failed to proceed to checkout. Please try again.");
    }
  };

  // Calculate total price
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.stockId.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
      {loading ? (
        <p>Loading...</p>
      ) : cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.stockId._id}>
                  <td>{item.stockId.name}</td>
                  <td>
                    <div className="quantity-controls">
                      <button
                        onClick={() => {
                          if (item.quantity <= 1) {
                            message.error("Cannot decrease quantity below 1.");
                            return;
                          }
                          updateQuantity(item.stockId._id, -1);
                        }}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => {
                          if (item.quantity >= item.stockId.quantity) {
                            message.error(
                              "Cannot increase quantity beyond available stock."
                            );
                            return;
                          }
                          updateQuantity(item.stockId._id, 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>₹{item.stockId.price}</td>
                  <td>
                    <button
                      className="remove-button"
                      onClick={() => removeFromCart(item.stockId._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-total">
            Total: <span>₹{totalPrice}</span>
          </div>
          <button className="checkout-button" onClick={proceedToCheckout}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;