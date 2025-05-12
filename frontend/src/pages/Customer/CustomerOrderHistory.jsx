import React, { useState, useEffect } from "react";
import { Spin, message } from "antd";
import axios from "axios";
import { API } from "../../utils/api.js";
import OrderHistoryTable from "../Shared/OrderHistoryTable";

const CustomerOrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API}orders/${userId}`);
        const data = response.data;

        // Ensure the data is an array
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          console.error("Unexpected API response format:", data);
          message.error("Failed to load order history.");
        }
      } catch (error) {
        console.error("Error fetching user orders:", error);
        message.error("Failed to load order history.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Order History</h1>
      {loading ? <Spin size="large" /> : <OrderHistoryTable orders={orders} />}
    </div>
  );
};

export default CustomerOrderHistory;