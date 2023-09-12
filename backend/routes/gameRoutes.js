// gameRoutes.js
const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.authenticate); // Middleware for authentication

router.get('/games', gameController.getGamesForUser);

module.exports = router;
