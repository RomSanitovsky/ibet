const fs = require('fs');
const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');

const User = require('./userModel');
const League = require('./leagueModel');
const pointsFormatSchema = require('./pointsFormatModel').pointsFormatSchema;
const groupDataSchema = require('./groupDataModel').groupDataSchema;

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: [true, 'group must have an name'],
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
      default: [],
    },
  ],
  data: {
    type: groupDataSchema,
    required: true,
    default: [],
  },

  league: {
    type: mongoose.Schema.ObjectId,
    ref: 'League',
  },
  pointsFormat: {
    type: pointsFormatSchema,
    required: true,
  },

  groupToken: {
    type: String,
    required: true,
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const checkPoints = function (userBet, gameInfo, pointFormat) {
  var total = 0;
  if (
    userBet.finalMatchWinner == 1 &&
    parseInt(gameInfo.hTeam.score.points) >
      parseInt(gameInfo.vTeam.score.points)
  ) {
    total += pointFormat.FinalMatchWinner;
  }
  if (
    userBet.finalMatchWinner == 2 &&
    parseInt(gameInfo.hTeam.score.points) <
      parseInt(gameInfo.vTeam.score.points)
  ) {
    total += pointFormat.FinalMatchWinner;
  }

  if (
    userBet.totalPoints ==
    parseInt(gameInfo.hTeam.score.points) +
      parseInt(gameInfo.vTeam.score.points)
  ) {
    total += pointFormat.Total;
  }

  return total;
};

groupSchema.methods.calcPoints = async function (user_id) {
  const games = JSON.parse(
    fs.readFileSync(`${__dirname}/../getExampleGamesUpdated.json`)
  ).games;
  var points = 0;
  this.users.forEach((user) => {
    var bets = this.data.userGroupBets.find((user_group_bets) => {
      return user_group_bets.user.toString() === user.toString();
    });
    bets.userBets.forEach((userBet) => {
      var gameId = userBet.gameId;
      var gameInfo = games.find((game) => game.gameId == gameId);
      if (gameInfo.statusGame == 'Finished') {
        points += checkPoints(userBet, gameInfo, this.pointsFormat);
      }
    });
    bets.currentScore = points;
    points = 0;
  });
};

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
//
//
