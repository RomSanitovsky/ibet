const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController.js');
const leagueController = require('../controllers/leagueController');

const router = express.Router();

router.use(authController.protect);

router.get('/league', leagueController.getAllLeagues);
router.get('/league/:id', leagueController.getLeague);

module.exports = router;
