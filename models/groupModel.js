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

groupSchema.methods.calcPoint = async (user_id) => {
  var points = 0;
  this.users.forEach((element) => {
    var bets = data.userGroupBets.find((user_group_bets) => {
      return user_group_bets.user == element;
    });
  });
};

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
