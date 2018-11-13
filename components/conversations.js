

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


let conversations = {};


conversations.options = (data,callback)=>{

	callback(200,data.headers);
	
}

conversations.post = (data,callback)=>{
	//send message
	
}

conversations.get = (data,callback)=>{
	//get all message
	//
}

conversations.delete = (data,callback)=>{
	//delete message
	//
}





module.exports = conversations;
