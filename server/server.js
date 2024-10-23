const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose'); // MongoDB ORM

const app = express();
const PORT = 443; // HTTPS port

// Load the SSL certificate and private key
const privateKey = fs.readFileSync(path.join(__dirname, 'server.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'server.cert'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/customerPayments', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Define user schema and model
const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  idNumber: { type: String, required: true },
  accountNumber: { type: String, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Serve the React app's static files from the 'build' directory
app.use(express.static(path.join(__dirname, '../client/build')));

// Routes for Registration, Login, and Payment
app.post('/api/register', async (req, res) => {
  const { fullname, idNumber, accountNumber, password } = req.body;

  try {
    // Hash the password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user and save it to the MongoDB database
    const newUser = new User({
      fullname,
      idNumber,
      accountNumber,
      password: hashedPassword
    });

    await newUser.save();
    
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { accountNumber, password } = req.body;

  try {
    // Find the user by accountNumber
    const user = await User.findOne({ accountNumber });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
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

app.post('/api/pay', async (req, res) => {
  const { amount, currency, accountInfo, swiftCode } = req.body;

  // Payment processing logic here
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


