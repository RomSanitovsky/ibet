const mongoose = require('mongoose');
const validator = require('validator');

const pointsFormatSchema = new mongoose.Schema({
  FinalMatchWinner: {
    type: Number,
    required: [true, 'PointsFormat must have a FinalMatchWinner'],
    validate: {
      //this only works on creat OR save!!!
      validator: function (el) {
        return el > 0;
      },
      message: 'finalMatchWinner score method must be greater than 0',
    },
  },

  Total: {
    type: Number,
    required: [true, 'PointsFormat must have a Total'],
    validate: {
      //this only works on creat OR save!!!
      validator: function (el) {
        return el > 0;
      },
      message: 'Total score method must be greater than 0',
    },
  },
  LeagueWinner : {
    type: String,
    required: [true, 'PointsFormat must have a leaguewinner'],
    validate: {
      //this only works on creat OR save!!!
      validator: function (el) {
        return el > 0;
      },
      message: 'leaguewinner method must be greater than 0',
    },
  },

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const PointsFormat = mongoose.model('PointsFormat', pointsFormatSchema);
module.exports = { PointsFormat, pointsFormatSchema };
