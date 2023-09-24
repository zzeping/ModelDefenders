// gameRoutes.js
const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const multer = require('multer');


const upload = multer(); 

router.post('/', upload.none(), gameController.createGame);
router.get('/', gameController.getAllGames);
router.get('/availables', gameController.getAvailableGames);
router.post('/join', upload.none(), gameController.joinGame)

module.exports = router;
