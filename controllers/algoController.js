const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const axios = require('axios');
const request = require('request');
const fs = require('fs');

exports.checkChances = catchAsync(async(req, res, next) => {
    
    var options = {
        method: 'GET',
        url: 'https://v1.basketball.api-sports.io/standings',
        qs: {league: '12', season: '2020-2021'},
        headers: {
          'x-rapidapi-host': 'v1.basketball.api-sports.io',
          'x-rapidapi-key': process.env.API_KEY
        }
      };
      
      request(options, function (error, response, body) {
          if (error) throw new Error(error);
        
          fs.writeFileSync('./getExample.json', body);
          res.status(200).json({
              success: "success"
          });
      });
});