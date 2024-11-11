import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeLogin from './components/EmployeeLogin';
import EmployeeDashboard from './components/EmployeeDashboard';
import PaymentForm from './components/PaymentForm';

function App() {
  return (
    <Router>
      <div>
        <h1>Employee Payments Portal</h1>
        <Routes>
          <Route path="/" element={<EmployeeLogin />} />  {/* Login page route */}
          <Route path="/login" element={<EmployeeLogin />} />  {/* Login route */}
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />  {/* Dashboard for employees */}
          <Route path="/payment" element={<PaymentForm />} />  {/* Payment form route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
