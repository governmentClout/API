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

db_helper.checkToken = (uuid,callback)=>{
	//check if token exists

	var db_result = false;

	let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + uuid + "'";


	con.query(verifyToken, (err,result)=>{
		db_helper.getResult(result);
	});
	

}

db_helper.getResult = (result)=>{
	return
}

module.exports = db_helper;