const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const axios = require('axios');
var request = require('request');
const NBA = require('nba');

const fs = require('fs');
const { map } = require('../app');
const Team = require('../models/teamModel');

exports.algoSetup = catchAsync(async (req, res, next) => {
  console.log(`${__dirname}`);
  var eliminated = fs
    .readFileSync('/app/EliminationList.txt')
    .toString()
    .split('\n');

  const results = await Team.find();

  for (let i = 0; i < 30; i++) {
    if (eliminated.includes(results[i].teamName.split(' ').join('_'))) {
      results[i].isEliminated = true;
    } else {
      results[i].isEliminated = false;
    }
  }
  const output = [];
  for (let i = 0; i < 30; i++) {
    output[i] = {};
    output[i].teamName = results[i].teamName;
    output[i].wins = results[i].wins;
    output[i].losses = results[i].losses;
    output[i].isEliminated = results[i].isEliminated;
  }

  output.sort((a, b) => {
    return b.wins / b.losses - a.wins / a.losses;
  });

  res.status(200).json({
    status: 'success',
    data: output,
  });
});
