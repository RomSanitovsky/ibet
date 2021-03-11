const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const axios = require('axios');
var request = require('request');
const NBA = require('nba');

const fs = require('fs');
const { map } = require('../app');

exports.checkChances = catchAsync(async (req, res, next) => {
  await axios
    .get('https://api-nba-v1.p.rapidapi.com/standings/standard/2020-2021', {
      headers: {
        'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
        'x-rapidapi-key': 'f97df4d38dmsh6bc2a968b7e539bp17dcb1jsn9c38f4b94a67',
      },
    })
    .then((data) =>
      fs.writeFileSync(
        './getExampleStandings.json',
        JSON.stringify(data.data.api)
      )
    );
  console.log('check1');

  await axios
    .get('https://api-nba-v1.p.rapidapi.com/games/seasonYear/2020-2021', {
      headers: {
        'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
        'x-rapidapi-key': 'f97df4d38dmsh6bc2a968b7e539bp17dcb1jsn9c38f4b94a67',
        useQueryString: true,
      },
    })
    .then((data) =>
      fs.writeFileSync('./getExampleGames.json', JSON.stringify(data.data.api))
    );

  console.log('check2');
  res.status(200).json({
    status: 'success',
  });
});

exports.algoSetup = catchAsync(async (req, res, next) => {
  const standings = JSON.parse(fs.readFileSync('./getExampleStandings.json'));
  const games = JSON.parse(fs.readFileSync('./getExampleGames.json'));

  const teamMap = new Map();

  const results = [];
  var temp;
  for (let i = 0; i < 30; i++) {
    results[i] = {};
    results[i].id = (i + 1).toString();
    results[i].apiId = standings.standings[i].teamId;

    //Set up map between 1-30 ids to API ids
    teamMap[standings.standings[i].teamId] = i + 1;

    results[i].wins = standings.standings[i].win;
    results[i].losses = standings.standings[i].loss;
    results[i].remaning = 72 - results[i].wins - results[i].losses;
    for (let j = 0; j <= 30; j++) {
      results[i][j] = 0;
    }
  }
  //getting remaining games
  for (let i = 0; i < 30; i++) {
    games.games.forEach((element) => {
      if (element.statusGame != 'Finished') {
        if (element.vTeam.teamId == results[i].apiId) {
          let opponent = teamMap[element.hTeam.teamId];
          results[i][opponent.toString()] = results[i][opponent.toString()] + 1;
        }
        if (element.hTeam.teamId == results[i].apiId) {
          let opponent = teamMap[element.vTeam.teamId];
          results[i][opponent.toString()] = results[i][opponent.toString()] + 1;
        }
      }
    });
  }

  fs.writeFileSync('./input.txt', results.length);
  fs.appendFileSync('./input.txt', '\n');

  results.forEach((el) => {
    fs.appendFileSync('./input.txt', `team${el.id} `);
    fs.appendFileSync('./input.txt', `${el.wins} `);
    fs.appendFileSync('./input.txt', `${el.losses} `);
    fs.appendFileSync('./input.txt', `${el.remaning} `);
    for (let i = 1; i <= 30; i++) {
      fs.appendFileSync('./input.txt', `${el[i.toString()]} `);
    }
    fs.appendFileSync('./input.txt', '\n');
  });

  var pro = require('child_process');
  const child = pro.spawn(`${__dirname}\\..\\cppSRC\\baseballElimination.exe`, [
    `${__dirname}\\..\\input.txt`,
  ]);

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  res.status(200).json({
    status: 'success',
  });
});

exports.getStandings = catchAsync(async (req, res, next) => {
  const standings = JSON.parse(fs.readFileSync('./getExampleStandings.json'));
  res.status(200).json({
    status: 'success',
    data: standings,
  });
});
