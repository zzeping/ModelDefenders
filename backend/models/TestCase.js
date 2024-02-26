const { sequelize, DataTypes } = require('./db')


const TestCase = sequelize.define('TestCase', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
    },
    events: {
        type: DataTypes.ARRAY(DataTypes.STRING),
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

TestCase.associate = (models) => {
    TestCase.belongsTo(models.Game, { foreignKey: 'gameId' });
    TestCase.belongsTo(models.User, { foreignKey: 'userId' });
}

module.exports = TestCase;