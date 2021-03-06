const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController.js');
const teamController = require('../controllers/teamsController');

const router = express.Router();

router.use(authController.protect);

router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeam);

module.exports = router;
