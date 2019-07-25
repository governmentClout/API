'use strict';
module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    nationalityOrigin: DataTypes.STRING,
    nationalityResidence: DataTypes.STRING,
    state: DataTypes.STRING,
    lga: DataTypes.STRING,
    photo: DataTypes.STRING,
    background: DataTypes.TEXT
  }, {});
  Profile.associate = function(models) {
    // associations can be defined here
    Profile.belongsTo(models.User);
  };
  return Profile;
};