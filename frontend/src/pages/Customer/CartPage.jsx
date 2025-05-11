import React, { useState, useEffect } from "react";
import { Card, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../utils/api.js"; // Correct for default export

const CartPage = ({ userId }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      console.error("User ID is null. Cannot fetch cart.");
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await axios.get(`${ API }cart/${userId}`);
        console.log("Fetched cart data:", response.data.items);
        setCart(response.data.items);
      } catch (error) {
        console.error("Error fetching cart:", error);
        message.error("Failed to load cart. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  const removeFromCart = async (stockId) => {
    try {
      await axios.delete(`${ API }cart/remove/${userId}/${stockId}`);
      setCart((prevCart) => prevCart.filter((item) => item.stockId._id !== stockId));
      message.success("Item removed from cart!");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      message.error("Failed to remove item from cart.");
    }
  };

  const updateQuantity = async (stockId, change) => {
    try {
      const response = await axios.put(
        `{ API }cart/update-quantity/${userId}/${stockId}`,
        { quantityChange: change }
      );

      // Refresh local cart with updated data
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.stockId._id === stockId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      message.error(error.response?.data?.message || "Failed to update quantity.");
    }
  };
  const navigate = useNavigate();

  const proceedToCheckout = () => {
    message.success("Proceeding to checkout...");
    navigate("/checkout");
  };


  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Cart</h1>
      {loading ? (
        <p>Loading...</p>
      ) : cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {cart.map((item, index) => (
              <Card
                key={`${item.stockId._id}-${index}`}
                title={item.stockId.name}
                style={{ width: 300 }}
              >
                <p>Price: ${item.stockId.price}</p>
                <p>Quantity: {item.quantity}</p>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <Button
                    onClick={() => {
                      if (item.quantity <= 1) {
                        message.error("Cannot decrease quantity below 1.");
                        return;
                      }
                      updateQuantity(item.stockId._id, -1);
                    }}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    onClick={() => {
                      if (item.quantity >= item.stockId.quantity) {
                        message.error("Cannot increase quantity beyond available stock.");
                        return;
                      }
                      updateQuantity(item.stockId._id, 1);
                    }}
                  >
                    +
                  </Button>
                </div>
                <Button
                  danger
                  style={{ marginTop: "10px" }}
                  onClick={() => removeFromCart(item.stockId._id)}
                >
                  Remove
                </Button>
              </Card>
            ))}
          </div>
          <h2>Total Price: ${cart.reduce((total, item) => total + item.stockId.price * item.quantity, 0)}</h2>
          <Button type="primary" style={{ marginTop: "20px" }} onClick={proceedToCheckout}>
            Proceed to Checkout
          </Button>
        </>
      )}
    </div>
  );
};

export default CartPage;
