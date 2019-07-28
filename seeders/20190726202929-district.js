'use strict';

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
   return queryInterface.bulkInsert('districts', [
      { name: 'District 1', stateId: 1, code: 'D1', createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'},
      { name: 'District 2', stateId: 2, code: 'D2', createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'},
      { name: 'District 3', stateId: 1, code: 'D3', createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'},
      { name: 'District 4', stateId: 2, code: 'D4', createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'},
      { name: 'District 5', stateId: 3, code: 'D5', createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'}        
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('districts', null, {});
  }
};
