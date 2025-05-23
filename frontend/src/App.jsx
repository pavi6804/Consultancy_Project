import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import "./App.css";

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
import StaffDashboard from "./pages/Staff/StaffDashBoard";
import StaffPurchaseSales from "./pages/Staff/StaffPurchaseSales";
import StaffBrowseStock from "./pages/Staff/StaffBrowseStock";

// customer pages
import CustomerBrowseStock from "./pages/Customer/CustomerBrowseStock";
import Home from "./pages/Customer/Home";
import ContactUs from "./pages/Customer/ContactUs";
import CartPage from "./pages/Customer/CartPage";
import CheckoutPage from "./pages/Customer/CheckoutPage";
import OrderHistory from "./pages/Customer/CustomerOrderHistory";
import Payment from "./pages/Customer/Payment";

// Authentication pages
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [cart, setCart] = useState([]);
  //const [userId, setUserId] = useState(null);
  const userId = localStorage.getItem("userId"); // Ensure userId is stored in localStorage after login
  const username = localStorage.getItem("username");


  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    //const userId = localStorage.getItem("userId");
 
    if (token && userRole && userId) {
      setIsAuthenticated(true);
      setRole(userRole);
      //setUserId(storedUserId); // <-- Ensure state is updated
    } else {
      setIsAuthenticated(false);
      setRole(null);
      //setUserId(null);
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
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
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
      <Routes>z
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
                <Route path="*" element={<Navigate to="/admin-dashboard" />} />
              </>
            )}
            {role === "staff" && (
              <>
                <Route path="/staff-dashboard" element={<StaffDashboard />} />
                <Route path="/purchase-sales" element={<StaffPurchaseSales />} />
                <Route path="/stock" element={<StaffBrowseStock />} />
                <Route path="*" element={<Navigate to="/staff-dashboard" />} />
              </>
            )}
            {role === "customer" && (
              <>
                <Route path="/home" element={< Home />} />
                <Route path="/browse-stock" element={<CustomerBrowseStock userId={userId} />} />
                <Route path="/cart" element={<CartPage userId = {userId} />} />
                <Route path="/checkout" element={<CheckoutPage userId={userId} cart={cart} />} /> 
                <Route path="/order-history" element={<OrderHistory userId={ userId } username={ username }/>} />
                <Route path="/contact-us" element={< ContactUs/> } />
                <Route path="*" element={<Navigate to="/home" />} />
                <Route path="/payment" element={<Payment userId={userId} />} />
              </>
            )}
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;