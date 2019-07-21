// User Model

const Sequelize = require('sequelize');
const db = require('../config/db');

const User = db.define('users',{
    uuid: {
        type: Sequelize.STRING,
        allowNull: false
      },
    email: {
        
    }
});

module.exports = User;