const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: true,
    },
    // The specific time slot the user booked from the route's schedule
    bookingTime: {
      type: String,
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Cancelled', 'Completed'],
      default: 'Confirmed',
    },
    seatNumber: {
      type: Number,
      // In a real system, you'd have a more complex seat allocation logic
      // For now, we'll assign a random one
      default: () => Math.floor(Math.random() * 40) + 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);