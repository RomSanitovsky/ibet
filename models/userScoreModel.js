const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./userModel');

const userScoreSchema = new mongoose.Schema({
  gameId: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const UserScore = mongoose.model('UserScore', userScoreSchema);
module.exports = UserScore;
