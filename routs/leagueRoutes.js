const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController.js');
const leagueController = require('../controllers/leagueController');

const router = express.Router();

router.use(authController.protect);

router.get('/', leagueController.getAllLeagues);
router.get('/:id', leagueController.getLeague);

module.exports = router;
