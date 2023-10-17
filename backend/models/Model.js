const { sequelize, DataTypes } = require('./db')


const Model = sequelize.define('Model', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    MXP: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('EDG', 'FSM'),
        allowNull: false,
    },
    difficulty: {
        type: DataTypes.ENUM('Easy', 'Intermediate', 'Advanced'),
        allowNull: false,
    },
});

Model.associate = (models) => {
    Model.hasMany(models.Game, { foreignKey: 'modelId', as: 'games', onDelete: 'CASCADE' });
    Model.belongsTo(models.User, { foreignKey: 'ownerId' });
}

module.exports = Model;