const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Team = require('../models/teamModel');

exports.getAllTeams = factory.getAll(Team);
exports.getTeam = factory.getOne(Team);
