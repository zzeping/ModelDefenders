// gameController.js
const Game = require('../models/Game');

// Get all games for a user
const getGamesForUser = async (req, res) => {
  try {
    const userId = req.userId; // Extracted from authentication middleware
    const games = await Game.find({ userId });

    res.status(200).json({ games });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};

module.exports = { getGamesForUser };
