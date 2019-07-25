'use strict';

const models = require('./index');

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    provider: DataTypes.STRING,
    dob: DataTypes.DATEONLY

  }, {});
  
  User.associate = function(models) {
    // associations can be defined here
    User.hasOne(models.Token, {
      foreignKey: 'userId'
    });

  };
  return User;
};