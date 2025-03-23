import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Senthil Textiles</Link>
      </div>
      <ul className="nav-links">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/purchase-sales">Purchase & Sales</Link>
        <Link to="/admin/stock">Stock</Link>
        <Link to="/admin/staff">Staff</Link>
        <li>
          <button className="logout-btn">Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
