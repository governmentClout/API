'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Profiles', {
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      }, 
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      nationalityOrigin: {
        type: Sequelize.STRING
      },
      nationalityResidence: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      lga: {
        type: Sequelize.STRING
      },
      photo: {
        type: Sequelize.STRING
      },
      background: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Profiles');
  }
};