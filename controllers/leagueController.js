const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const League = require('../models/leagueModel');

exports.getAllLeagues = catchAsync(async (req, res, next) => {
  const leagues = await League.find().populate('teams');
  leagues[0].teams.sort((a, b) => {
    a.winningPrecentage - b.winningPrecentage;
  });
  res.status(200).json({
    status: 'success',
    results: leagues.length,
    data: leagues,
  });
});
exports.getLeague = factory.getOne(League);
