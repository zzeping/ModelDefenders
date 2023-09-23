const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.RDS_DB_NAME,
  process.env.RDS_USERNAME,
  process.env.RDS_PASSWORD, {
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT,
  dialect: 'postgres',
}
);

const Game = sequelize.define('Game', {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  },
});

Game.associate = (models) => {
  Game.belongsTo(models.User, { foreignKey: 'ownerId' });
  Game.belongsTo(models.User, { foreignKey: 'defenderId' });
  Game.belongsTo(models.User, { foreignKey: 'attackerId' });
  Game.belongsTo(models.Model, { foreignKey: 'modelId' });
  Game.hasMany(models.TestCase, { foreignKey: 'gameId', as: 'testcases', onDelete: 'CASCADE' });
  Game.hasMany(models.Mutant, { foreignKey: 'gameId', as: 'mutants', onDelete: 'CASCADE' });
}

module.exports = Game;
