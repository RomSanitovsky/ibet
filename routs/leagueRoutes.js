const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController.js');
const algoController = require('../controllers/algoController');

const router = express.Router();

router.use(authController.protect);

module.exports = router;
