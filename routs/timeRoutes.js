const express = require('express');
const timeController = require('../controllers/timeController');

const router = express.Router();

router.route('/back').get(timeController.goBack);
router.route('/now').get(timeController.goFront);

module.exports = router;
