import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Admin/DashBoard";
import StaffDetails from "./pages/Admin/StaffDetails";
import PurchaseSales from "./pages/PurchaseSales";
import BrowseStock from "./pages/BrowseStock";
import Comments from "./pages/Admin/StaffComments";

const App = () => {
  const [startDate, setStartDate] = useState("2024-03-12");
  const [endDate, setEndDate] = useState("2025-03-11");

  const salesData = Array.from({ length: 100 }, (_, i) => {
    const randomDay = Math.floor(Math.random() * 365);
    const date = new Date(2024, 2, 12 + randomDay).toISOString().split("T")[0];
    return {
      date,
      description: `Transaction ${i + 1}`,
      type: i % 2 === 0 ? "Towel" : "Bedsheet",
      items: Math.floor(Math.random() * 10) + 1,
      price: Math.floor(Math.random() * 500) + 100,
      company: i % 2 === 0 ? "ABC Textiles" : "XYZ Fabrics",
      transactionType: i % 2 === 0 ? "Purchase" : "Sale",
    };
  });

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/admin" element={<Dashboard salesData={salesData} startDate={startDate} endDate={endDate} />} />
        <Route path="/admin/staff" element={<StaffDetails />} />
        <Route path="/admin/purchase-sales" element={<PurchaseSales />} />
        <Route path="/admin/stock" element={<BrowseStock />} />
        <Route path="/admin/comments" element={<Comments />} />
      </Routes>
    </Router>
  );
};

export default App;
