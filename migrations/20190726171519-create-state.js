'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('States', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isAlpha: true
        }
      },
      shortcode: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isAlpha: true
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'beginTime',
        defaultValue: sequelize.literal('NOW()')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('States');
  }
};