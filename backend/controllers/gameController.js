const Game = require('../models/Game');
const { Op } = require('../models/db')


class gameController {

  static async createGame(req, res) {
    const game = req.body;
    console.log(req.body)
    try {
      const createdGame = await Game.create(game);
      res.status(201).json({ message: "Game created successfully!", game: createdGame })
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getAllGames(req, res) {
    try {
      const games = await Game.findAll();
      res.status(200).json(games);
    } catch (err) {
      res.status(404).json({ message: err.message })
    }
  }

  static async getAvailableGames(req, res) {
    try {
      const availableGames = await Game.findAll({
        where: {
          [Op.or]: [
            { defenderId: null },
            { attackerId: null },
          ],
        },
      });
      res.status(200).json(availableGames);
    } catch (err) {
      res.status(404).json({ message: err.message })
    }
  }

  static async joinGame(req, res) {
    const userId = req.params.userId; 
    const gameId = req.params.gameId;
    try {
      const game = await Game.findByPk(gameId);
      if (!game) {
        return res.status(404).json({ message: 'Game not found.' });
      }
      if (game.defenderId === null) {
        game.defenderId = userId;
      } else if (game.attackerId === null) {
        game.attackerId = userId;
      } else {
        return res.status(400).json({ message: 'Game is already full.' });
      }
      await game.save();
      res.status(200).json({ message: 'Joined the game successfully.', game });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }


}


module.exports = gameController;
