import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API } from '../../utils/api.js'; // Ensure this path is correct

const CheckoutPage = () => {
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');

    const userId = localStorage.getItem('userId');

    if (!userId) {
      setError('User not logged in. Please log in to continue.');
      return;
    }

    if (!address || !phoneNumber) {
      setError('Please fill in all the fields.');
      return;
    }

    try {
      const response = await axios.post(`${ API }orders/place`, {
        userId,
        address,
        phoneNumber,
      });

      if (response.status === 200) {
        alert('Order placed successfully!');
        navigate('/payment');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <form onSubmit={handleCheckout} className="checkout-form">
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="checkout-button">Place Order</button>
      </form>
    </div>
  );
};

export default CheckoutPage;