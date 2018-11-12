

const _db = require('./../lib/migrations');
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


let recommendations = {};


recommendations.options = (data,callback)=>{

	callback(200,data.headers);
	
}


recommendations.get = (data,callback)=>{
	//send message
	//
}






module.exports = recommendations;
