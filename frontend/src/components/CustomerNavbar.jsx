import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const CustomerNavbar = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Senthil Textiles</Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/browse-stock">Browse Stock</Link>
        </li>
        <li>
          <Link to="/cart">Cart</Link>
        </li>
        <li>
          <Link to="/order-history">Order History</Link>
        </li>
        <li>
          <Link to="/contact-us">Contact Us</Link>
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

export default CustomerNavbar;