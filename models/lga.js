'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lga = sequelize.define('Lga', {
    name: DataTypes.STRING,
    stateId: DataTypes.INTEGER,
    districtId: DataTypes.INTEGER
  }, {});
  Lga.associate = function(models) {
    // associations can be defined here
  };
  return Lga;
};