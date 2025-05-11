import React, { useState, useEffect } from "react";
import { Spin, message } from "antd";
import axios from "axios";
import { API } from "../../utils/api.js";
import OrderHistoryTable from "../Shared/OrderHistoryTable.jsx";

const StaffOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API}orders/staff`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching staff orders:", error);
        message.error("Failed to load order history.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Assigned Orders</h1>
      {loading ? <Spin size="large" /> : <OrderHistoryTable orders={orders} />}
    </div>
  );
};

export default StaffOrderHistory;