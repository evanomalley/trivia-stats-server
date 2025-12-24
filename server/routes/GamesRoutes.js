const express = require('express');
const router = express.Router();
const gamesContoller = require('../controllers/GamesController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/')
.get(gamesContoller.getAllGames)
.post(gamesContoller.addGame);

router.route('/game/:gameId')
.get(gamesContoller.getGame);

module.exports = router;