const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController.js');
const groupController = require('../controllers/groupController');

const router = express.Router();

router.use(authController.protect);

router.get('/share/:id', groupController.shareGroup);
router.get('/:id', groupController.getGroup);
router.post('/', groupController.createGroup);

module.exports = router;
