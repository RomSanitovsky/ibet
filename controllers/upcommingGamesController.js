const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const upcomingGames = require('../models/upcomingGamesModel');
const User = require('../models/userModel');

exports.getUpcommingGames = catchAsync(async (req, res, next) => {
  const result = await upcomingGames.findOne();

  res.status(200).json({
    status: 'success',
    results,
  });
});
