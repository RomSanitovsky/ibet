const mongoose = require('mongoose');
const validator = require('validator');

const userBetSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: [true, 'userBet muse have a game id'],
  },
  finalMatchWinner: {
    type: Number,
    required: [true, 'userBetSchema must have an FinalMatchWinner'],
    validate: {
      //this only works on creat OR save!!!
      validator: function (el) {
        return el == 1 || el == 2;
      },
      message: 'FinalMatchWinner must be 1 or 2',
    },
  },

  totalPoints: {
    type: Number,
    required: [true, 'userBetSchema must have an totalPoints'],
    validate: {
      //this only works on creat OR save!!!
      validator: function (el) {
        return el >= 0;
      },
      message: 'totalPoints must be greater or equal to 0',
    },
  },
});

module.exports = userBetSchema;
