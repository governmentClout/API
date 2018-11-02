/**
Database Helper, hence takes care of all database functions.
**/

const mysql = require('mysql');
const config = require('./config.js');

const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name

});

let db_helper = {};

db_helper.checkToken = (token,uuid)=>{
	//check if token exists

	var db_result = false;

	let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + uuid + "'";


	return con.query(verifyToken);
	

}


module.exports = db_helper;