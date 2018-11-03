
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');
const tokens = require('./../lib/tokenization');
const wrapper = require('node-mysql-wrapper'); 


const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name

});



let db = wrapper.wrap(con);


let usersTable = db.table("users"); 


const tests = {};

tests.get = (callback)=>{

	usersTable.find({mail:"= xyluz@ymail.com"},function(results){
 		console.log(result);
	});

}

module.exports = tests;