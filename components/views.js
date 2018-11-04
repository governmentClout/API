
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


views = {};

views.options = (data,callback)=>{

	callback(200,data.headers);
	
}

views.get = (data,callback)=>{

	callback(200,{'success':'you have hit views get endpoint'})

}

views.post = (data,callback)=>{

	callback(200,{'success':'you have hit views post endpoint'})

}

views.delete = (data,callback)=>{

	callback(200,{'success':'you have hit views delete endpoint'})

}






module.exports = shares;
