import React from "react";
import { FaClock, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import "./ContactUs.css"; // Import the CSS file

const ContactUs = () => {
  return (
    <div className="contactUs">
      <h2 className="title">Contact Us</h2>
      <div className="contactGrid">
        <div className="contactBox">
          <FaClock className="icon" />
          <h3>Office Hours</h3>
          <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
          <p>Saturday: 10:00 AM - 4:00 PM</p>
        </div>
        <div className="contactBox">
          <FaEnvelope className="icon" />
          <h3>Email</h3>
          <p>support@example.com</p>
          <p>info@example.com</p>
        </div>
        <div className="contactBox">
          <FaMapMarkerAlt className="icon" />
          <h3>Address & Phone</h3>
          <p>123 Main Street, City, Country</p>
          <p><FaPhoneAlt /> +1 234 567 890</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;