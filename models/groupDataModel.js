const mongoose = require('mongoose');
const validator = require('validator');
const userBetSchema = require('./userBetInfoModel');

const groupDataSchema = new mongoose.Schema({
  userGroupBets: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
      currentScore: {
        type: Number,
        default: 0,
        validate: {
          //this only works on creat OR save!!!
          validator: function (el) {
            return el >= 0;
          },
          message: 'currentScore must be >= 0',
        },
      },
      userBets: [{ type: userBetSchema, default: [] }],
    },
  ],

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const GroupData = mongoose.model('GroupData', groupDataSchema);
module.exports = { GroupData, groupDataSchema };

// GroupData = [
//     user_id = {
//         points: int,
//         bets: [UserBetMatch]
//     }
// ]
