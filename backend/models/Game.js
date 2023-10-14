const { sequelize, DataTypes } = require('./db')

const Game = sequelize.define('Game', {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  },
  modelId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  defenderId: {
    type: DataTypes.UUID,
  },
  attackerId: {
    type: DataTypes.UUID,
  },
  notation: {
    type: DataTypes.ENUM('MERODE', 'UML'),
    allowNull: false,
    defaultValue: 'MERODE',
  }
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
