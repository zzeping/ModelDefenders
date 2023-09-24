const { sequelize, DataTypes } = require('./db')


const Mutant = sequelize.define('Mutant', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
    },
    state: {
        type: DataTypes.ENUM('dead', 'alive'),
        allowNull: false,
        defaultValue: 'alive',
    },
    MXP: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    gameId: {
        type: DataTypes.UUID,
        allowNull: false,
    },

});

Mutant.associate = (models) => {
    Mutant.belongsTo(models.Game, { foreignKey: 'gameId' });
    Mutant.belongsTo(models.User, { foreignKey: 'userId' });
}

module.exports = Mutant;