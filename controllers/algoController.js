const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const axios = require('axios');
var request = require('request');
const NBA = require('nba');

const fs = require('fs');

exports.checkChances = catchAsync(async (req, res, next) => {
  await axios
    .get('https://v1.basketball.api-sports.io/standings', {
      params: {
        league: '12',
        season: '2020-2021',
      },
      headers: {
        'x-rapidapi-host': 'v1.basketball.api-sports.io',
        'x-rapidapi-key': process.env.API_KEY,
      },
    })
    .then((data) =>
      fs.writeFileSync(
        './getExampleStandings.json',
        JSON.stringify(data.data.response)
      )
    );
  console.log('check1');

  await axios
    .get('https://v1.basketball.api-sports.io/games', {
      params: {
        league: 12,
        season: '2020-2021',
      },
      headers: {
        'x-rapidapi-host': 'v1.basketball.api-sports.io',
        'x-rapidapi-key': process.env.API_KEY,
      },
    })
    .then((data) =>
      fs.writeFileSync(
        './getExampleGames.json',
        JSON.stringify(data.data.response)
      )
    );

  console.log('check2');
  res.status(200).json({
    status: 'success',
  });
});
