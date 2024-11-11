import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/EmployeeDashboard.css';


const EmployeeDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token'); // Ensure the token is stored after login

    if (!token) {
      setError('You must log in first');
      return;
    }

    axios.get('http://localhost:5000/api/employee/transactions', { // Use your backend API URL
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        console.log('Fetched Transactions:', response.data); // Debugging: Log the response
        setTransactions(response.data);
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
        setError('Error fetching transactions');
      });
  }, []);

  return (
    <div className="employee-dashboard">
      <h2>Employee Dashboard</h2>
      {error && <p className="error-message">{error}</p>}
      {!transactions.length && !error ? (
        <p className="loading">No transactions available. Please check back later.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>SWIFT Code</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction._id}>
                <td>{transaction.customerName}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.currency}</td>
                <td>{transaction.swiftCode}</td>
                <td>{transaction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeDashboard;
