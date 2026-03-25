const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();


// @route   GET api/auth/me
// @desc    Get logged in user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // req.user.id is set by the auth middleware
    const user = await User.findById(req.user.id).select('-password').populate('bus');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.post('/login', async (req, res) => {
  const { matricNumber, password } = req.body;

  try {
    const user = await User.findOne({ matricNumber });
    

    if (!user) {
      return res.status(401).json({ message: 'Invalid matric number or password' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid matric number or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, matricNumber: user.matricNumber },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // 1 day
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        matricNumber: user.matricNumber,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;