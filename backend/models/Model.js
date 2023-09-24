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
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createType: {
        type: DataTypes.ENUM('lecturer', 'student'),
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
    notation: {
        type: DataTypes.ENUM('MERODE', 'UML'),
        allowNull: false,
        defaultValue: 'MERODE',
    },
});

Model.associate = (models) => {
    Model.hasMany(models.Game, { foreignKey: 'modelId', as: 'games', onDelete: 'CASCADE' });
}

module.exports = Model;