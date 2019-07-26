'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Profiles', {
      id: {
        allowNull: false,      
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      }, 
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          is: ["^[a-z]+$",'i']
        }
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          is: ["^[a-z]+$",'i']
        }
      },
      nationalityOrigin: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nationalityResidence: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lga: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      photo: {
        type: Sequelize.STRING,
        defaultValue: "",
        validate: {
          is: ["^[a-z]+$",'i']
        }
      },
      background: {
        type: Sequelize.TEXT,
        defaultValue: "",
        validate: {
          is: ["^[a-z]+$",'i']
        }
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