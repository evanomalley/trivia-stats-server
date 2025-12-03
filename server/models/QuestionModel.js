const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        // user: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true,
        //     ref: 'User'
        // },
        category: {type: String, required: true},
        question: {type: String, required: true},
        answer: {type: String, required: true},
        bonus: {type: Boolean, default: false},
        date: {type: String},
        hintSong: {type: String},
        answeredCorrectly: {type: Boolean},
    }
)

const model = mongoose.model('Question', questionSchema);

module.exports = model;