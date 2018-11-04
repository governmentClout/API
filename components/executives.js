
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


executives = {};

executives.options = (data,callback)=>{

	callback(200,data.headers);
	
}

executives.get = (data,callback)=>{

	callback(200,{'success':'you have hit executives get endpoint'})

}

executives.post = (data,callback)=>{

	callback(200,{'success':'you have hit executives post endpoint'})

}

executives.delete = (data,callback)=>{

	callback(200,{'success':'you have hit executives delete endpoint'})

}






module.exports = shares;
