import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";

// navbar components
import AdminNavbar from "./components/AdminNavbar";
import StaffNavbar from "./components/StaffNavbar";
import CustomerNavbar from "./components/CustomerNavbar";

// admin pages
import AdminDashboard from "./pages/Admin/AdminDashBoard";
import StaffDetails from "./pages/Admin/StaffDetails";
import AdminPurchaseSales from "./pages/Admin/AdminPurchaseSales";
import AdminBrowseStock from "./pages/Admin/AdminBrowseStock";

// staff pages
import StaffDashboard from "./pages/Staff/StaffDashboard";
import StaffPurchaseSales from "./pages/Staff/StaffPurchaseSales";
import StaffBrowseStock from "./pages/Staff/StaffBrowseStock";

// customer pages
import CustomerBrowseStock from "./pages/Customer/CustomerBrowseStock";
import Home from "./pages/Customer/Home";
import ContactUs from "./pages/Customer/ContactUs";

// Authentication pages
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    if (token && userRole) {
      setIsAuthenticated(true);
      setRole(userRole);
    }
  }, []);

  const onLogin = (userRole) => {
    setIsAuthenticated(true);
    setRole(userRole);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <Router>
      {isAuthenticated && (
        <>
          {role === "admin" && <AdminNavbar onLogout={handleLogout} />}
          {role === "staff" && <StaffNavbar onLogout={handleLogout} />}
          {role === "customer" && <CustomerNavbar onLogout={handleLogout} />}
        </>
      )}
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login onLogin={(role) => onLogin(role)}/>} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            {role === "admin" && (
              <>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/staff" element={<StaffDetails />} />
                <Route path="/purchase-sales" element={<AdminPurchaseSales />} />
                <Route path="/stock" element={<AdminBrowseStock />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            )}
            {role === "staff" && (
              <>
                <Route path="/staff-dashboard" element={<StaffDashboard />} />
                <Route path="/purchase-sales" element={<StaffPurchaseSales />} />
                <Route path="/stock" element={<StaffBrowseStock />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            )}
            {role === "customer" && (
              <>
                <Route path="/" element={< Home />} />
                <Route path="/browse-stock" element={<CustomerBrowseStock />} />
                <Route path="/contact-us" element={< ContactUs/> } />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;