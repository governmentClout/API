
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

let login = {};

login.options = (data,callback)=>{

	callback(200,data.headers);
	
}

login.post = (data,callback)=>{

//check token
	let email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length >= 10 ? data.payload.email.trim() : false;
	let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

	if(email && password){

		let hashedPassword = helpers.hash(password);

		const login = "SELECT uuid,email,phone,dob FROM users WHERE email='" + email + "' AND password='" + hashedPassword + "'";
		

		con.query(login,  (err,result) => {

			if(!err && result.length > 0){

				// console.log('fields ' + fields);

				let verifyToken = "SELECT token FROM tokens WHERE uuid='" + result[0].uuid + "' LIMIT 1";
				
				con.query(verifyToken, (err,tokenResult)=>{

					// console.log('Token: ' + tokenResult);

					if(
						!err && 
						tokenResult &&
						tokenResult.length > 0 
					){
						
					let finalReqult = Object.assign(...result, ...tokenResult);
						callback(200,{'user':finalReqult});

					}else{
						callback(500,{'Error':'Login failed, token Not found or expired'});
					}

				});
				//get token, and sent to them. using uuid
				

			}else{
				console.log(err);
				callback(404,{'Error':'User not found'});
			}

		});

	}
}

module.exports = login;
