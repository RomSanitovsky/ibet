const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./userModel');
const UserScore = require('./userScoreModel');

const scoreBoardSchema = new mongoose.Schema({
    
    userScoreList: [{
        type: mongoose.Schema.ObjectId,
        ref: 'UserScore',
        default: []
    }],

    active: {
        type :Boolean,
        default: true,
        select: false
    }
});



const ScoreBoard = mongoose.model('ScoreBoard' , scoreBoardSchema);
module.exports = ScoreBoard; 