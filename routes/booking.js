const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const Route = require('../models/Route');
const auth = require('../middleware/auth');

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', auth, async (req, res) => {
  const { routeId, bookingTime, bookingDate } = req.body;

  try {
    // Basic validation
    if (!routeId || !bookingTime || !bookingDate) {
      return res.status(400).json({ msg: 'Please provide all required booking details.' });
    }

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ msg: 'Route not found.' });
    }

    const newBooking = new Booking({
      user: req.user.id,
      route: routeId,
      bookingTime,
      bookingDate: new Date(bookingDate),
    });

    const booking = await newBooking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/bookings
// @desc    Get all bookings for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
    
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('route', ['name', 'bus'])
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add this new route at the bottom
// @route   GET /api/bookings/driver
// @desc    Get bookings for the logged-in driver's bus
// @access  Private (Driver only)
router.get('/driver', auth, async (req, res) => {
  try {
    // Assuming User has a field 'bus' (ObjectId ref to Bus model)
    // If not, you can adjust logic (e.g. find bus by driver id)
    const driver = await User.findById(req.user.id).select('bus');
    if (!driver || !driver.bus) {
      return res.status(400).json({ msg: 'No bus assigned to this driver' });
    }

    // Find routes that use this bus
    const routes = await Route.find({ bus: driver.bus }).select('_id');

    if (routes.length === 0) {
      return res.json([]);
    }

    const routeIds = routes.map(r => r._id);

    // Get bookings for those routes, upcoming or today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({
      route: { $in: routeIds },
      bookingDate: { $gte: today },
    })
      .populate('user', ['name', 'matricNumber'])
      .populate('route', ['name'])
      .sort({ bookingDate: 1, bookingTime: 1 });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;