import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Authentication.css";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful!");
        localStorage.setItem("token", data.token); // Save token to localStorage
        localStorage.setItem("role", data.user.role); // Save role to localStorage

        setTimeout(() => {
          onLogin(data.user.role); // Update authentication state
          if (data.user.role === "admin") {
            navigate("/admin-dashboard");
          } else if (data.user.role === "staff") {
            navigate("/staff-dashboard");
          } else {
            navigate("/");
          }
        }, 2000);
      } else {
        toast.error(data.message || "Login failed!");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
    }
  };

  return (
    <div className="form-container">
      <ToastContainer />
      <form className="form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="form-button">
          Login
        </button>
        <p className="toggle-text">
          Don't have an account?{" "}
          <span
            onClick={() => {
              console.log("Toggle to register page clicked");
              navigate("/register");
            }}
            className="toggle-link"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;