// gameRoutes.js
const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const multer = require('multer');


const upload = multer(); 

router.post('/', upload.none(), gameController.createGame);
router.get('/', gameController.getAllGames);
router.delete('/:id', gameController.deleteGame);

router.get('/user/:id', gameController.getUserGames);
router.get('/availables/:id', gameController.getAvailableGames);
router.get('/:id', gameController.getGame);
router.post('/join', upload.none(), gameController.joinGame)

module.exports = router;
