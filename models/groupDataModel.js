const mongoose = require('mongoose');
const validator = require('validator');

const groupDataSchema = new mongoose.Schema({
  data: {
    type: Object,
    default: {},
  },

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const GroupData = mongoose.model('GroupData', groupDataSchema);
module.exports = GroupData;

// GroupData = [
//     user_id = {
//         points: int,
//         bets: [UserBetMatch]
//     }
// ]
