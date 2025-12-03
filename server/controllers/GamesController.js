const Games = require('../models/GameModel');
const Question = require('../models/QuestionModel');
const asyncHandler = require('express-async-handler');
const _ = require('lodash');


const getAllGames = asyncHandler (async (req, res) => {
    const games = await Games.find({}, {questions: 0}).lean();

    // If no games
    if (!games?.length) {
        return res.status(400).json({ message: 'No games found' });
    }

    res.json(games);
});

const addGame = asyncHandler (async (req, res) => {
    const {user, date, questions} = req.body;

    const questionsToInsert = [];

    // Check data
    if(!user || !date || !Array.isArray(questions)){
        return res.status(400).json({message: "All fields required"});
    }

    // Check for all questions
    if(questions.length !== 20){
        return res.status(400).json({message: "Not a full game, please add all 20 questions"});
    }

    // validation check
    _.forEach(questions, q => {
        const {category, question, answer} = q;

        if(!category || !question || !answer){
            return res.status(400).json({message: "Invalid question found"});
        }

        questionsToInsert.push({
            category, question, answer, date
        });
    });

    let newQuestions = [];

    await Question.insertMany(questionsToInsert).then((docs) => {
        newQuestions = docs;
    })
    .catch((err) => {
        return res.status(400).json({message:'Error adding questions'});
    });

    // Extract the IDs from the inserted documents
    const questionIds = newQuestions.map(q => q._id);

    await Games.create({ date, questions: questionIds});

    return res.status(201).json({ message: 'New game created' });
});

const getGame = asyncHandler (async (req, res) => {
    const {gameId} = req.params;

    // Check data
    if(!gameId){
        return res.status(400).json({message: "No game ID specified"});
    }

    const game = await Games.findById(gameId).lean().exec();

    const gameQuestions = await Promise.all(game.questions.map(async (q) => {
        const found = await Question.findById(q).lean().exec()
        return found
    }))


    if(!game){
        return res.status(404).json({ message: 'No game found' });
    }

    return res.json({ ...game, questions: gameQuestions });
});

module.exports = {
    getAllGames,
    addGame,
    getGame
}