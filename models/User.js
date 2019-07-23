'use strict';

const models = require('./index');

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
    User.hasOne(models.Token);
  };
  return User;
};