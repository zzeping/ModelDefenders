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

  static async getGame(req, res) {
    const id = req.params.id;
    try {
      const game = await Game.findOne({ where: { id } });
      res.status(200).json(game);
    } catch (err) {
      res.status(404).json({ message: err.message })
    }
  }

  static async deleteGame(req, res) {
    const id = req.params.id;
    try {
      const game = await Game.findByPk(id);
      if (!game) {
        return res.status(401).json({ error: 'Game not found.' });;
      }
      await game.destroy();
      res.status(200).json({ message: "Game deleted successfully!" })
    } catch (err) {
      res.status(404).json({ message: err.message })
    }
  }

  static async getAvailableGames(req, res) {
    const id = req.params.id;
    try {
      const availableGames = await Game.findAll({
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                { defenderId: null },
                {
                  attackerId: {
                    [Op.not]: id,
                  },
                },
              ],
            },
            {
              [Op.and]: [
                { attackerId: null },
                {
                  defenderId: {
                    [Op.not]: id,
                  },
                },
              ],
            },
            {
              [Op.and]: [
                { attackerId: null },
                { defenderId: null },
              ],
            },
          ]
        },
      });
      res.status(200).json(availableGames);
    } catch (err) {
      res.status(404).json({ message: err.message })
    }
  }

  static async getUserGames(req, res) {
    const id = req.params.id;
    try {
      const userGames = await Game.findAll({
        where: {
          [Op.or]: [
            { defenderId: id },
            { attackerId: id },
            { ownerId: id },
          ],
        },
      });
      res.status(200).json(userGames);
    } catch (err) {
      res.status(404).json({ message: err.message })
    }
  }

  static async joinGame(req, res) {
    const userId = req.body.userId;
    const gameId = req.body.gameId;
    const role = req.body.role;
    try {
      const game = await Game.findByPk(gameId);
      if (!game) {
        return res.status(404).json({ message: 'Game not found.' });
      }
      if (role === "defender") {
        game.defenderId = userId;
      } else if (role === "attacker") {
        game.attackerId = userId;
      } else {
        return res.status(400).json({ message: 'Cannot join as defender or attacker.' });
      }
      await game.save();
      res.status(200).json({ message: 'Joined the game successfully.', game });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }


}


module.exports = gameController;
