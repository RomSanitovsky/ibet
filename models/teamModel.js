const mongoose = require('mongoose');
const validator = require('validator');

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: [true, 'team must have an name'],
    unique: [true],
  },
  wins: {
    type: Number,
    required: true,
  },
  losses: {
    type: Number,
    required: true,
  },
  remaning: {
    type: Number,
    required: true,
  },
  winningPrecentage: {
    type: Number,
    required: true,
  },
  logo: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
