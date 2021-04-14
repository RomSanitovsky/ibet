const express = require('express');
const upcomingGamesController = require('../controllers/upcommingGamesController');

const router = express.Router();

router.use(authController.protect);

router.get('/', upcomingGamesController.getUpcommingGames);

module.exports = router;
