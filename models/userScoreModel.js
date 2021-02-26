const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./userModel');

const userScoreSchema = new mongoose.Schema({
    score : {
        type: Number,
        default: 0,
    },

    user :{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },

    active: {
        type :Boolean,
        default: true,
        select: false
    }
});



const UserScore = mongoose.model('UserScore' , userScoreSchema);
module.exports = UserScore; 