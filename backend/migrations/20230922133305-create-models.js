'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Models', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      MXP: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createType: {
        type: Sequelize.ENUM('lecturer', 'student'),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('EDG', 'FSM'),
        allowNull: false,
      },
      notation: {
        type: Sequelize.ENUM('MERODE', 'UML'),
        allowNull: false,
        defaultValue: 'MERODE',
      },
      difficulty: {
        type: Sequelize.ENUM('Easy', 'Intermediate', 'Advanced'),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Models');
  },
};
