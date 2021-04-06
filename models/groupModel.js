const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./userModel');
const League = require('./leagueModel');
const PointsFormat = require('./pointsFormatModel');
const GroupData = require('./groupDataModel');

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
      required: true,
    },
  ],

  league: {
    type: mongoose.Schema.ObjectId,
    ref: 'League',
    required: true,
  },
  pointsFormat: {
    type: PointsFormat,
    required: true,
  },
  groupData: {
    type: mongoose.Schema.ObjectId,
    ref: 'GroupData',
    required: true,
  },

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

groupSchema.pre(/^find/, function (next) {
  this.populate('pointsFormat').populate('groupData');

  next();
});

groupSchema.methods.calcPoint = async (user_id) => {
  var points = 0;
  var userBets = this.groupData[user_id];
  if (userBets) {
  }
};

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
