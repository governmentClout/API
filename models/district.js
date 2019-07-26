'use strict';
module.exports = (sequelize, DataTypes) => {
  const District = sequelize.define('District', {
    name: DataTypes.STRING,
    stateId: DataTypes.INTEGER,
    code: DataTypes.STRING
  }, {});
  District.associate = function(models) {
    // associations can be defined here
  };
  return District;
};