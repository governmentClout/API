
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


notitications = {};

notitications.options = (data,callback)=>{

	callback(200,data.headers);
	
}

notitications.add = (data,callback)=>{
	//post notification
	
}

notitications.get = (data,callback)=>{
	//get notifications
}


module.exports = notitications;
