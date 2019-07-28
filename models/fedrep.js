'use strict';
module.exports = (sequelize, DataTypes) => {
  const FedRep = sequelize.define('FedRep', {
    name: DataTypes.STRING,
    districtId: DataTypes.INTEGER
  }, {});
  FedRep.associate = function(models) {
    // associations can be defined here
    District.belongsTo(models.District);
  };
  return FedRep;
};