const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const axios = require('axios');

exports.checkChances = catchAsync(async(req, res, next) => {
    
    const leagueId = req.params.leagueId;    
});