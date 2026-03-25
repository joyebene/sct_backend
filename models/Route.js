const mongoose = require('mongoose');

// Explicitly require the Bus model to ensure it's registered before being referenced.
require('./Bus');

const RouteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  // Example: ["08:00", "10:00", "12:00"]
  schedule: [
    {
      type: String,
      required: true,
    },
  ],
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: true,
    },
  });

module.exports = mongoose.model('Route', RouteSchema);