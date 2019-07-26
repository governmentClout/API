'use strict';

module.exports = (sequelize, DataTypes) => {

  const Token = sequelize.define('Token', {

    userId: DataTypes.UUID,
    token: DataTypes.STRING

  }, {});

  Token.associate = function(models) {
    Token.belongsTo(models.User);
  };

  return Token;
};