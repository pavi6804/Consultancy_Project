import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const AdminNavbar = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Senthill Textiles</Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/admin-dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/purchase-sales">Purchase & Sales</Link>
        </li>
        <li>
          <Link to="/stock">Browse Stock</Link>
        </li>
        <li>
          <Link to="/staff">Staff Details</Link>
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

export default AdminNavbar;