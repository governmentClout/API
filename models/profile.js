'use strict';

module.exports = (sequelize, DataTypes) => {

  const Profile = sequelize.define('Profile', {
    
    userId: DataTypes.UUID,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    nationalityOrigin: DataTypes.STRING,
    nationalityResidence: DataTypes.STRING,
    stateId: DataTypes.STRING,
    lgaId: DataTypes.STRING,
    photo: DataTypes.STRING,
    background: DataTypes.TEXT

  }, {});

  Profile.associate = function(models) { 
    
    Profile.belongsTo(models.User);
    Profile.belongsTo(models.State);
    // Profile.belongsTo(models.District);
    // Profile.belongsTo(models.FedRep);
    Profile.belongsTo(models.Lga);
    
  };
  return Profile;
};