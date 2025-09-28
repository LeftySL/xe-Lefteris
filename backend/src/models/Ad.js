const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 155,
  },
  type: {
    type: String,
    required: true,
    enum: ['Rent', 'Buy', 'Exchange', 'Donation'],
  },
  area: {
    type: String,
    required: true,
  },
  placeId: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;