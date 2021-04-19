const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const League = require('../models/leagueModel');

exports.getAllLeagues = catchAsync(async (req, res, next) => {
  const leagues = await League.find();
  leagues.forEach(function (element, index, theArray) {
    theArray[index] = 'hello world';
  });
});
exports.getLeague = factory.getOne(League);
