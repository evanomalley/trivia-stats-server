const req = require('express/lib/request');
const mongoose = require('mongoose');

const gamesSchema = new mongoose.Schema(
    {
        // user: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true,
        //     ref: 'User'
        // },
        date: {type: String, required: true},
        questions: {type: Array, required: true}
    }
)

const model = mongoose.model('Games', gamesSchema);

module.exports = model;