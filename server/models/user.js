const mongoose = require('mongoose');

// Define the User schema (for employees, no registration process)
const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
