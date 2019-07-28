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
      { name: 'FedRep 1', districtId: 1, createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'},
      { name: 'FedRep 2', districtId: 2, createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'},
      { name: 'FedRep 3', districtId: 1, createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'},
      { name: 'FedRep 4', districtId: 2, createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'},
      { name: 'FedRep 5', districtId: 3, createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'}        
    ], {});

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
