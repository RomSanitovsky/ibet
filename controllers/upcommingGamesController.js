const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const upcomingGames = require('../models/upcomingGamesModel');
const User = require('../models/userModel');

exports.getUpcommingGames = catchAsync(async (req, res, next) => {
  const result = await upcomingGames.findOne();
  result.games.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  res.status(200).json({
    status: 'success',
    result,
  });
});
