const mongoose = require('mongoose');
const validator = require('validator');

const upcomingGamesSchema = new mongoose.Schema({
  games: [
    {
      gameId: { type: String, required: true },
      hTeam: { type: String, required: true },
      vTeam: { type: String, required: true },
      date: { type: Date, required: true },
      default: [],
    },
  ],
});

const UpcommingGames = mongoose.model('UpcommingGames', upcomingGamesSchema);
module.exports = UpcommingGames;
