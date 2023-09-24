const { sequelize, DataTypes } = require('./db')

const User = sequelize.define('User', {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user',
  },
});

User.associate = (models) => {
  User.hasMany(models.Game, { foreignKey: 'ownerId', as: 'ownerOfGames', onDelete: 'CASCADE' });
  User.hasMany(models.Game, { foreignKey: 'defenderId', as: 'defenderOfGames' });
  User.hasMany(models.Game, { foreignKey: 'attackerId', as: 'attackerOfGames' });
  User.hasMany(models.TestCase, { foreignKey: 'userId', as: 'defender', onDelete: 'CASCADE' });
  User.hasMany(models.Mutant, { foreignKey: 'userId', as: 'attacker', onDelete: 'CASCADE' });
}

module.exports = User;
