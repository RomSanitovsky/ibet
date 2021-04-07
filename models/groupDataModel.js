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
      userBets: [{ type: userBetSchema, default: [] }],
      default: [],
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
