'use strict';

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {

    uuid: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    dob: DataTypes.STRING,
    tosAgreement: DataTypes.STRING

  }, {});
  
  User.associate = function(models) {
    // associations can be defined here
    User.hasOne(Token);
  };
  return User;
};