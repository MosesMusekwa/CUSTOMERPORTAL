import '../styles/PaymentForm.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentForm = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [accountInfo, setAccountInfo] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();

  const validateInput = () => {
    const amountPattern = /^\d+(\.\d{1,2})?$/;
    if (!amountPattern.test(amount)) return 'Amount should be valid with up to 2 decimal places.';

    const currencyPattern = /^[A-Z]{3}$/;
    if (!currencyPattern.test(currency)) return 'Currency should be a valid 3-letter code.';

    const accountInfoPattern = /^[a-zA-Z0-9\s]+$/;
    if (!accountInfoPattern.test(accountInfo)) return 'Account Information should be alphanumeric.';

    const swiftPattern = /^[A-Z0-9]{8,11}$/;
    if (!swiftPattern.test(swiftCode)) return 'SWIFT Code should be 8 to 11 alphanumeric characters.';

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to access this form.');
      return;
    }

    try {
      await axios.post('https://localhost/api/pay', { amount, currency, accountInfo, swiftCode }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaymentSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      alert('Payment failed');
    }
  };

  return (
    <div className="payment-container">
      {paymentSuccess ? (
        <div className="payment-success">
          <h3>Payment Successful!</h3>
          <p>Redirecting to the home page in 3 seconds...</p>
        </div>
      ) : (
        <form className="payment-form" onSubmit={handleSubmit}>
          <h2>Payment Form</h2>
          {error && <p className="error-message">{error}</p>}
          <input type="text" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <input type="text" placeholder="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
          <input type="text" placeholder="Account Information" value={accountInfo} onChange={(e) => setAccountInfo(e.target.value)} />
          <input type="text" placeholder="SWIFT Code" value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} />
          <button type="submit">Pay Now</button>
        </form>
      )}
    </div>
  );
};

export default PaymentForm;




