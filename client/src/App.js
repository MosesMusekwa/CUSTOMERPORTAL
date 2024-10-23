import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import PaymentForm from './components/PaymentForm';

function App() {
  return (
    <Router>
      <div>
        <h1>Customer Payments Portal</h1>
        <Routes>
          <Route path="/" element={<Register />} />  {/* Default route */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/payment" element={<PaymentForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


