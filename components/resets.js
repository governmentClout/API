
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');
const tokens = require('./../lib/tokenization');



const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name

});


resets = {};

resets.options = (data,callback)=>{

	callback(200,data.headers);
	
}

resets.post = (data,callback)=>{
	//check that reset link has not expired
}


resets.put = (data,callback)=>{
	//update password
}

resets.get = (data,callback)=>{
	//get reset email
	
}


module.exports = resets;
