const mongoose = require('mongoose');

// Define the Payment schema
const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links payment to the User model
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  accountInfo: {
    type: String,
    required: true,
  },
  swiftCode: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processed', 'Failed'], // Payment status
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the creation date
  },
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
