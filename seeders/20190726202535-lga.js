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
    return queryInterface.bulkInsert('lgas', [
      { name: 'Lga 1', districtId: 1, stateId: 1, createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'},
      { name: 'Lga 2', districtId: 2, stateId: 2, createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'},
      { name: 'Lga 3', districtId: 1, stateId: 3, createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'},
      { name: 'Lga 4', districtId: 2, stateId: 4, createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'},
      { name: 'Lga 5', districtId: 3, stateId: 5, createdAt: '2019-07-26 14:12:14', updatedAt: '2019-07-26 14:12:14'}        
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('lgas', null, {});
  }
};
