const fs = require('fs');
const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./userModel');
const League = require('./leagueModel');
const pointsFormatSchema = require('./pointsFormatModel').pointsFormatSchema;
const groupDataSchema = require('./groupDataModel').groupDataSchema;
const { data } = require('nba');

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: [true, 'group must have an name'],
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
      default: [],
    },
  ],
  data: {
    type: groupDataSchema,
    required: true,
  },

  league: {
    type: mongoose.Schema.ObjectId,
    ref: 'League',
    required: true,
  },
  pointsFormat: {
    type: pointsFormatSchema,
    required: true,
  },

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const checkPoints = function (userBet , gameInfo ,pointFormat ) {

};

groupSchema.methods.calcPoint = async (user_id) => {
  const games = JSON.parse(fs.readFileSync(`${__dirname}/../getExampleGames.json`));
  var points = 0;
  this.users.forEach((user) => {
    var bets = data.userGroupBets.find((user_group_bets) => {
      return user_group_bets.user == user;
    });
    bets.userBets.forEach(userBet => {
      var gameId = el.gameId;
      var gameInfo = games.find(game => game.gameId == gameId);
      if (gameInfo.statusGame == 'Finished'){
        points += checkPoints(userBet, gameInfo , this.pointFormat);
      }
    });

    

  });
};

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
