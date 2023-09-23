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

});

Mutant.associate = (models) => {
    Mutant.belongsTo(models.Game, { foreignKey: 'gameId' });
    Mutant.belongsTo(models.User, { foreignKey: 'userId' });
}

module.exports = Mutant;