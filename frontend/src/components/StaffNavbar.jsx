import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const StaffNavbar = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Senthil Textiles</Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/staff-dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/purchase-sales">Purchase & Sales</Link>
        </li>
        <li>
          <Link to="/stock">Browse Stock</Link>
        </li>
        <li>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default StaffNavbar;