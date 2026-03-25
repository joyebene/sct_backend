const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    // e.g., "BUS-001", "BUS-002"
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  capacity: {
    type: Number,
    required: true,
    default: 40,
  },
  model: {
    type: String,
    trim: true,
    default: 'Standard City Bus',
  },
}, { timestamps: true });

module.exports = mongoose.model('Bus', BusSchema);