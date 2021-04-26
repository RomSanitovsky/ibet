/* eslint-disable no-await-in-loop */
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const League = require('../models/leagueModel');
const Team = require('../models/teamModel');
const upcomingGames = require('../models/upcomingGamesModel');
const email = require('../utils/email');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

const dataMaker = async () => {
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

  await axios
    .get('https://api-nba-v1.p.rapidapi.com/teams/league/standard', {
      headers: {
        'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
        'x-rapidapi-key': 'f97df4d38dmsh6bc2a968b7e539bp17dcb1jsn9c38f4b94a67',
        useQueryString: true,
      },
    })
    .then((data) =>
      fs.writeFileSync('./getTeams.json', JSON.stringify(data.data.api))
    );

  const standings = JSON.parse(fs.readFileSync('./getExampleStandings.json'));
  const games = JSON.parse(fs.readFileSync('./getExampleGames.json'));
  const teams = JSON.parse(fs.readFileSync('./getTeams.json')).teams;

  var now = new Date();
  email({
    email: 'fsdprojects2020@gmail.com',
    subject: now.toString().concat('    GAMES'),
    message: JSON.stringify(games),
  });
  email({
    email: 'fsdprojects2020@gmail.com',
    subject: now.toString().concat('    STANDINGS'),
    message: JSON.stringify(standings),
  });

  const teamMap = new Map();

  try {
    await League.deleteMany();
    await Team.deleteMany();
    await upcomingGames.deleteMany();
  } catch (err) {
    console.log(err);
  }

  const results = [];
  var temp;
  for (let i = 0; i < 30; i++) {
    results[i] = {};
    results[i].id = (i + 1).toString();
    results[i].apiId = standings.standings[i].teamId;

    //Set up map between 1-30 ids to API ids
    teamMap[standings.standings[i].teamId] = i + 1;

    console.log('creating teams');

    teams.forEach((team) => {
      if (team.teamId === results[i].apiId) {
        results[i].teamName = team.fullName;
        results[i].logo = team.logo;
      }
    });
    results[i].wins = standings.standings[i].win;
    results[i].losses = standings.standings[i].loss;
    results[i].remaning = 72 - results[i].wins - results[i].losses;
    results[i].winningPrecentage =
      Math.round(
        (parseInt(results[i].wins) /
          (parseInt(results[i].wins) + parseInt(results[i].losses))) *
          100
      ) / 100;
    await Team.create(results[i]);
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

  console.log('writing');
  fs.writeFileSync('./input.txt', `${results.length}`);
  fs.appendFileSync('./input.txt', '\n');
  console.log('writing');
  results.forEach((el) => {
    fs.appendFileSync('./input.txt', `${el.teamName.split(' ').join('_')} `);
    fs.appendFileSync('./input.txt', `${el.wins} `);
    fs.appendFileSync('./input.txt', `${el.losses} `);
    fs.appendFileSync('./input.txt', `${el.remaning} `);
    for (let i = 1; i <= 30; i++) {
      fs.appendFileSync('./input.txt', `${el[i.toString()]} `);
    }
    fs.appendFileSync('./input.txt', '\n');
  });

  console.log('spawning algorithm');

  var pro = require('child_process');
  const child = pro.spawn(`${__dirname}/../cppSRC/baseballElimination`, [
    `./input.txt`,
  ]);

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  console.log('creating leagues');

  const teamsCreated = await Team.find();

  const teamsIDsArray = [];
  teamsCreated.forEach((el) => {
    teamsIDsArray.push(el.id);
  });

  const nba = {};
  nba.leagueName = 'NBA';
  nba.teams = teamsIDsArray;

  await League.create(nba);

  console.log('creating upcoming games');

  var nowDate = new Date();
  const upcoming = [];
  games.games.forEach((game) => {
    var gameDate = new Date(game.startTimeUTC);
    const diffTime = Math.abs(gameDate - nowDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const upcomingGame = {};
    upcomingGame.gameId = game.gameId;

    upcomingGame.date = gameDate;
    if (game.statusGame != 'Finished') {
      if (diffDays < 7) {
        upcomingGame.status = 'ThisWeek';
      } else {
        upcomingGame.status = 'NotYet';
      }
    } else {
      upcomingGame.status = 'Finished';
      upcomingGame.hScore = parseInt(game.hTeam.score.points);
      upcomingGame.vScore = parseInt(game.vTeam.score.points);
    }
    const hometeam = teamsCreated.find((el) => {
      return el.teamName == game.hTeam.fullName;
    });
    const awayteam = teamsCreated.find(
      (el) => el.teamName == game.vTeam.fullName
    );
    if (hometeam && awayteam) {
      upcomingGame.hTeam = hometeam._id;
      upcomingGame.vTeam = awayteam._id;
      upcoming.push({ ...upcomingGame });
    }
  });

  await upcomingGames.create({ games: upcoming });

  setTimeout(dataMaker, 1000 * 60 * 60 * 3);

  console.log('Done! data is ready now!');
};

module.exports = dataMaker;
//
