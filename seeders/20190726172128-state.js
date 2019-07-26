'use strict';

const models = require('../models/index');

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   return queryInterface.bulkInsert('states', [
          { name: 'Lagos', shortcode: 'LA', createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'},
          { name: 'Abuja', shortcode: 'ABJ', createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'},
          { name: 'Ogun', shortcode: 'OG', createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'},
          { name: 'Edo', shortcode: 'ED', createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'},
          { name: 'Kwara', shortcode: 'KW', createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'}        
        ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('states', null, {});
  }
};
