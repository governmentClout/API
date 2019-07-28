'use strict';
module.exports = (sequelize, DataTypes) => {
  
  const State = sequelize.define('State', {

    name: DataTypes.STRING,
    shortcode: DataTypes.STRING

  }, {});
  State.associate = function(models) {
    // associations can be defined here
    State.hasMany(models.Lga, {
      foreignKey: 'stateId'
    });
    State.hasMany(models.District, {
      foreignKey: 'stateId'
    });
  };
  return State;
};