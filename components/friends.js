
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


friends = {};

friends.options = (data,callback)=>{

	callback(200,data.headers);
	
}

friends.get = (data,callback)=>{

	callback(200,{'success':'you have hit friends get endpoint'})

}

friends.post = (data,callback)=>{

	callback(200,{'success':'you have hit friends post endpoint'})

}

friends.delete = (data,callback)=>{

	callback(200,{'success':'you have hit friends delete endpoint'})

}






module.exports = shares;
