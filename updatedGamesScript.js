const fs = require('fs');
const axios = require('axios');

const newGames = async function () {
  await axios
    .get('https://api-nba-v1.p.rapidapi.com/games/seasonYear/2020-2021', {
      headers: {
        'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
        'x-rapidapi-key': 'f97df4d38dmsh6bc2a968b7e539bp17dcb1jsn9c38f4b94a67',
        useQueryString: true,
      },
    })
    .then((data) =>
      fs.writeFileSync(
        './getExampleGamesUpdated.json',
        JSON.stringify(data.data.api)
      )
    );
};

newGames();
