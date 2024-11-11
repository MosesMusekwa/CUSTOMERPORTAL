const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose'); // MongoDB ORM
const helmet = require('helmet'); // Security middleware
const rateLimit = require('express-rate-limit'); // Rate limiting

const app = express();
const PORT = 443; // HTTPS port

// Load the SSL certificate and private key
const privateKey = fs.readFileSync(path.join(__dirname, 'server.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'server.cert'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet()); // Set secure HTTP headers
app.use(rateLimit({ // Prevent brute force and DDoS attacks
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/customerPayments', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Define user schema and model (no registration, only pre-configured employees)
const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Serve the React app's static files from the 'build' directory
app.use(express.static(path.join(__dirname, '../client/build')));

// Employee login route (static login for employees)
app.post('/api/employee/login', async (req, res) => {
  const { accountNumber, password } = req.body;

  try {
    // Find the employee by accountNumber
    const user = await User.findOne({ accountNumber });
    if (!user) {
      return res.status(400).json({ message: 'Employee not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Dummy JWT token (replace with actual JWT generation)
    const token = 'dummy-jwt-token';
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Payment routes for employee to process payments
app.post('/api/employee/pay', async (req, res) => {
  const { amount, currency, accountInfo, swiftCode } = req.body;
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Please log in first.' });
  }

  // Employee payment processing logic here
  // The transaction is securely stored in the database
  res.json({ message: 'Payment processed successfully' });
});

// Fallback route to serve React's index.html for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Create the HTTPS server
https.createServer(credentials, app).listen(PORT, () => {
  console.log(`HTTPS server running on https://localhost:${PORT}`);
});
