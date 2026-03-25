const express = require('express');
const router = express.Router();
const Route = require('../models/Route');
const auth = require('../middleware/auth');

// @route   GET api/routes
// @desc    Get all available routes
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const routes = await Route.find().populate('bus');
    res.json(routes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;