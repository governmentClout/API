
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


administrators = {};

administrators.options = (data,callback)=>{

	callback(200,data.headers);
	
}

administrators.get = (data,callback)=>{

	callback(200,{'success':'you have hit executives get endpoint'})

}

administrators.post = (data,callback)=>{

	callback(200,{'success':'you have hit executives post endpoint'})

}

administrators.delete = (data,callback)=>{

	callback(200,{'success':'you have hit executives delete endpoint'})

}






module.exports = shares;
