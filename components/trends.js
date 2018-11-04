
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');

const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name

});


trends = {};

trends.options = (data,callback)=>{

	callback(200,data.headers);
	
}

trends.get = (data,callback)=>{

	callback(200,{'You have hit the trends get endpoint'});
	
}


module.exports = trends;
