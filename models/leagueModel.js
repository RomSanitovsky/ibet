const mongoose = require('mongoose');
const validator = require('validator');
const Team = require('./teamModel');

const leagueSchema = new mongoose.Schema({
  leagueName: {
    type: String,
    required: [true, 'league must have an name'],
    unique: [true],
  },
  teams: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Team',
      default: [],
    },
  ],

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const League = mongoose.model('League', leagueSchema);
module.exports = League;
