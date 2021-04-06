const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./userModel');
const UserBetInfo = require('./userBetInfoModel');

const userGroupBetsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },

  bets: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'UserBetInfo',
      required: true,
    },
  ],
});

const UserGroupBets = mongoose.model('UserGroupBets', userGroupBetsSchema);
module.exports = UserGroupBets;
