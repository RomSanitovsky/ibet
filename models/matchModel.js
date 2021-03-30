const mongoose = require('mongoose');
const validator = require('validator');

const matchScema = new mongoose.Schema({
  matchId: {
    type: String,
    required: true,
  },

  startTimeUTC: {
    type: Date,
  },

  hTeam: {
    type: String,
  },

  hTeamScore: {
    type: Number,
  },

  vTeam: {
    type: String,
  },
  vTeamScore: {
    type: Number,
  },

  statusGame: {
    type: String,
    required: true,
  },

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const Match = mongoose.model('Match', matchScema);
module.exports = Match;
