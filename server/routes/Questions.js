const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/QuestionsController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/')
    .get(questionsController.getAllQuestions)
    .post(questionsController.addSingleQuestion);

router.route('/getQuestion/:questionId')
    .get(questionsController.getSingleQuestion);

router.route('/updateQuestion/:questionId')
    .put(questionsController.updateQuestion);
    
module.exports = router;