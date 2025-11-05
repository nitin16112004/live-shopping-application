const mongoose = require('mongoose');

const shoppingRoomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Room title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Room description is required']
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  status: {
    type: String,
    enum: ['scheduled', 'live', 'ended'],
    default: 'scheduled'
  },
  scheduledTime: {
    type: Date,
    required: [true, 'Scheduled time is required']
  },
  startedAt: {
    type: Date
  },
  endedAt: {
    type: Date
  },
  maxViewers: {
    type: Number,
    default: 100
  },
  currentViewers: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ShoppingRoom', shoppingRoomSchema);
