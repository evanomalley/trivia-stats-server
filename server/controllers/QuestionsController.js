const Question = require('../models/QuestionModel');
const asyncHandler = require('express-async-handler');

// @desc Get all questions
// @route GET /questions
// @access private
const getAllQuestions = asyncHandler (async (req, res) => {
    // Get all notes from MongoDB
    const questions = await Question.find().lean()

    // If no questions 
    if (!questions?.length) {
        return res.status(400).json({ message: 'No questions found' })
    }

    // // Add username to each note before sending the response 
    // // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // // You could also do this with a for...of loop
    // const notesWithUser = await Promise.all(notes.map(async (note) => {
    //     const user = await User.findById(note.user).lean().exec()
    //     return { ...note, username: user.username }
    // }))

    res.json(questions)
});

// @desc add one questiomns
// @route POST /questions
// @access private
const addSingleQuestion = asyncHandler(async (req, res ) => {
    const {category, question, answer} = req.body;

    if(!category || !question || !answer){
        return res.status(400).json({message: "Missing question params"});
    }

    await Question.create({category, question, answer});

    return res.status(201).json({ message: 'New question created' });
})

// @desc Get one question
// @route GET /questions/getQuestion
// @access private
const getSingleQuestion = asyncHandler(async (req, res ) => {
    const {questionId} = req.params;

    if(!questionId){
        return res.status(400).json({message: "No id present"});
    }

    const found = await Question.findById(questionId).lean().exec();

    if(!found){
        return res.status(404).json({message: "No question found"});
    }

    return res.json(found);
})

const updateQuestion = asyncHandler(async (req, res ) => {
    const {questionId} = req.params;
    const {category, question, answer, date, bonus} = req.body;
    console.log(req.body);

    if(!questionId){
        return res.status(400).json({message: "No id present"});
    }

    const found = await Question.findById(questionId).lean().exec();

    if(!found){
        return res.status(404).json({message: "No question found"});
    }

    const updated = await Question.findByIdAndUpdate(questionId, {category, question, answer, date, bonus}, {new: true}).lean().exec();

    return res.json(`Question has been updated: ${updated.question}`);
})

module.exports = {
    getAllQuestions,
    addSingleQuestion,
    updateQuestion,
    getSingleQuestion
}