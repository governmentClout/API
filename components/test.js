const config = require('./../lib/config');
const mysql = require('mysql'); 

const dbhelper = require('./../lib/db_helper');


let con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name

});



const tests = {};

tests.get = (callback)=>{

	let u = dbhelper.checkToken('decca9fd-b867-4089-bac7-0ebe1ad3d5f2')
	
	console.log(u);

}

module.exports = tests;