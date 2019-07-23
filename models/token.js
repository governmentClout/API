'use strict';
module.exports = (sequelize, DataTypes) => {

  const Token = sequelize.define('Token', {

    uuid: DataTypes.UUID,
    token: DataTypes.STRING

  }, {});

  Token.associate = function(models) {
    // associations can be defined here
    Token.belongsTo(User);
  };

  return Token;
};