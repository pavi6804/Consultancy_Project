import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Import the CSS file for styling

const Home = () => {
  const navigate = useNavigate();

  const handleBrowseStock = () => {
    navigate('/browse-stock'); // Navigate to the Browse Stock page
  };

  return (
  <div className="home-wrapper">
    <div className="home-container">
      <h1 className="home-title">Welcome to Senthil Textiles</h1>
      <p className="home-content">
        Discover a wide range of high-quality textiles and fabrics. Shop now and experience the best in textile craftsmanship.
      </p>
      <button className="home-button" onClick={handleBrowseStock}>
        Browse Stock
      </button>
    </div>
  </div>
);

};

export default Home;