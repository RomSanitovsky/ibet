const mongoose = require('mongoose');
const validator = require('validator');
const Team = require('../models/teamModel');
const upcomingGamesSchema = new mongoose.Schema({
  games: {
    type: [
      {
        gameId: { type: String, required: true },
        hTeam: { type: mongoose.Schema.ObjectId, ref: 'Team', required: true },
        vTeam: { type: mongoose.Schema.ObjectId, ref: 'Team', required: true },
        hScore: { type: Number, required: true, default: 0 },
        vScore: { type: Number, required: true, default: 0 },
        date: { type: Date, required: true },
        status: {
          type: String,
          required: true,
          enum: ['Finished', 'ThisWeek', 'NotYet'],
        },
      },
    ],
    default: [],
  },
});

const UpcommingGames = mongoose.model('UpcommingGames', upcomingGamesSchema);
module.exports = UpcommingGames;
