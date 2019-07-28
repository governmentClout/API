'use strict';
module.exports = (sequelize, DataTypes) => {
  const FedRep = sequelize.define('FedRep', {
    name: DataTypes.STRING,
    districtId: DataTypes.INTEGER
  }, {});
  FedRep.associate = function(models) {
    // associations can be defined here
    FedRep.belongsTo(models.District);
   
  };
  return FedRep;
};