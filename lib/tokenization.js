const config = require('./config');
const mysql = require('mysql');
const randomString = require("randomstring");

const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name

});


const token = {};

token.generate = (uuid) => {
	//takes uuid of user, create a new token and inserts it into the database
	uuid = typeof(uuid) == 'string' && uuid.trim().length > 10 ? uuid.trim() : false;
	let token = randomString.generate(100);;

	if(uuid && token){
		//connect to db
		return token; 

	}else{
		return false;
	}


}

token.checkExpire = (uuid,token) => {
	//check if a token has expired

	

}

token.refresh = (uuid,token)=> {
	//update expired token
}

token.verify = (uuid,token)=>{
	//verify if a token is valid
}

module.exports = token;