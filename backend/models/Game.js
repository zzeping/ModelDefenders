const { Sequelize, DataTypes } = require('sequelize');
const db = require('../../database/postgresql');

const Game = db.define('Game', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Game;
