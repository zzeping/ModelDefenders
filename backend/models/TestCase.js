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

const TestCase = sequelize.define('TestCase', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
    },
    outCome: {
        type: DataTypes.ENUM('pass', 'fail'),
        allowNull: false,
    },
    events: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    }
});

TestCase.associate = (models) => {
    TestCase.belongsTo(models.Game, { foreignKey: 'gameId' });
    TestCase.belongsTo(models.User, { foreignKey: 'userId' });
}

module.exports = TestCase;