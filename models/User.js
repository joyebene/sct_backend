const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Explicitly require the Bus model to ensure it's registered before being referenced.
require('./Bus');

const userSchema = new mongoose.Schema({
  matricNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'driver', 'admin'],
    default: 'student',
  },
   bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      // This field is only relevant for users with the 'driver' role
    },
  name: {
    type: String,
    required: true,
  },

}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);