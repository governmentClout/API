/**
For validating data submitted to modules
**/

const mysql = require('mysql');
const config = require('./../lib/config');

const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name

});

let validator = {};

validator.message = [];

validator.getSingle = (table='users',column='phone',value='')=>{
	//check if user account is found in the database return error object

	const check = "SELECT * FROM " + table + " WHERE " + column + "='" + value + "'";
	// return con.query;
	 con.query(check,  (err,result) => {
	 	
	 	if(result.length > 0 && !err){

	 	}else{
	 		
	 	}
		
	});

}

module.exports = validator;