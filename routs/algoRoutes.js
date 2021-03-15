const express = require('express');
const algoController = require('../controllers/algoController');

const router = express.Router();

router.route('/').get(algoController.checkChances);
router.route('/standings').get(algoController.algoSetup);

module.exports = router;
