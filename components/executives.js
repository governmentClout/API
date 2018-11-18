
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
	//get executives for a single pereson
	// -- this must be area based... obviously president is the same for everyone, 
	// -- state should be that of origin, (add state of origin to profile)
	//and other areas

	callback(200,{'success':'you have hit executives get endpoint'})

}

executives.post = (data,callback)=>{
	//request to become an executve
	//update executive profile
	//
	callback(200,{'success':'you have hit executives post endpoint'})

}

executives.delete = (data,callback)=>{
	//change executive profile
	//
	callback(200,{'success':'you have hit executives delete endpoint'})

}






module.exports = shares;
