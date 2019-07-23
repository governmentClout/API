'use strict';

const models = require('./index');

module.exports = (sequelize, DataTypes) => {

  const Token = sequelize.define('Token', {

    uuid: DataTypes.UUID,
    token: DataTypes.STRING

  }, {});

  Token.associate = function(models) {
    // associations can be defined here
    Token.belongsTo(models.User);
  };

  return Token;
};