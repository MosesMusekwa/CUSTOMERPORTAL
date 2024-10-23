import '../styles/Register.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [fullname, setFullname] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateInput = () => {
    const namePattern = /^[a-zA-Z\s]+$/;
    if (!namePattern.test(fullname)) return 'Full name should contain only letters and spaces.';

    const idPattern = /^\d{13}$/;
    if (!idPattern.test(idNumber)) return 'ID Number should be 13 digits long.';

    const accountPattern = /^[a-zA-Z0-9]+$/;
    if (!accountPattern.test(accountNumber)) return 'Account Number should be alphanumeric.';

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) return 'Password must be at least 8 characters long and contain one uppercase, one lowercase, one number, and one special character.';

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

    try {
      const res = await axios.post('https://localhost/api/register', {
        fullname, idNumber, accountNumber, password,
      });
      alert(res.data.message);
      if (res.data.message === 'User registered successfully') {
        navigate('/login');
      }
    } catch (error) {
      alert('Error registering');
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register Page</h2>
        {error && <p className="error-message">{error}</p>}
        <input type="text" placeholder="Full Name" value={fullname} onChange={(e) => setFullname(e.target.value)} />
        <input type="text" placeholder="ID Number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
        <input type="text" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;





