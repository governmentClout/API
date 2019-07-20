// Mainly to check if mysql is installed and connected correctly

const mysql = require('mysql');
const config = require('./config.js');

const db = {}


 db.nopool = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name,
  multipleStatements: true

});

db.withpool = mysql.createPool({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name,
  multipleStatements: true

});


module.exports = db;
