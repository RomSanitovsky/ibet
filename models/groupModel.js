const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./userModel');
const Scoreboard = require('./scoreboardModel');

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: [true, 'group must have an name'],
    unique: [true],
    lowercase: [true],
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  adminUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },

  users: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  ],

  scoreManager: {
    type: mongoose.Schema.ObjectId,
    ref: 'Scoreboard',
    required: true,
  },

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
