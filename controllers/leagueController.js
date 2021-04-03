const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const League = require('../models/leagueModel');

exports.getAllLeagues = factory.getAll(League);
exports.getLeague = factory.getOne(League);
