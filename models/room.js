const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  roomType: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  currentOccupants: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;