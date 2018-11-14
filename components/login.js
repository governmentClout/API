const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');
const tokens = require('./../lib/tokenization');

const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name,
  multipleStatements: true

});

let login = {};

login.options = (data,callback)=>{

	callback(200,data.headers);
	
}

login.post = (data,callback)=>{

	let email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length >= 10 ? data.payload.email.trim() : false;
	let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	let provider = typeof(data.payload.provider) == 'string' && data.payload.provider.trim().length > 0 ? data.payload.provider.trim() : false;

	if(email && password && provider){

		if(provider == 'email'){

			let hashedPassword = helpers.hash(password);

			const login = "SELECT uuid,email,phone,dob FROM users WHERE email='" + email + "' AND password='" + hashedPassword + "'";
			

			con.query(login,  (err,result) => {

				if(!err && result.length > 0){

					let verifyToken = "SELECT token FROM tokens WHERE uuid='" + result[0].uuid + "' LIMIT 1; SELECT * FROM profiles where uuid='" + result[0].uuid 	+"'";
					
					con.query(verifyToken, (err,tokenResult)=>{

						console.log('Token: ' + tokenResult);

						if(
							!err && 
							tokenResult &&
							tokenResult.length > 0 
						){
							
						let finalReqult = Object.assign(...result, ...tokenResult[0],...tokenResult[1]);
							callback(200,{'user':finalReqult});

						}else{
							callback(500,{'Error':'Login failed, token Not found or expired'});
						}

					});
					

				}else{
					
					console.log(err);
					callback(404,{'Error':err});
				}

			});

		}

		if(
			provider == 'twitter' || 
			provider == 'facebook' || 
			provider == 'linkedin' || 
			provider == 'google'  
			){

				const login = "SELECT uuid,email,phone,dob FROM users WHERE email='" + email + "' AND provider='"+provider+"'";
			

				con.query(login,  (err,result) => {

					if(!err && result.length > 0){

						let verifyToken = "SELECT token FROM tokens WHERE uuid='" + result[0].uuid + "' LIMIT 1; SELECT * FROM profiles where uuid='" + result[0].uuid 	+"'";
						
						con.query(verifyToken, (err,tokenResult)=>{

							if(
								!err && 
								tokenResult &&
								tokenResult.length > 0 
							){
								
							let finalReqult = Object.assign(...result, ...tokenResult[0],...tokenResult[1]);
								callback(200,{'user':finalReqult});

							}else{
								callback(500,{'Error':'Login failed, token Not found or expired'});
							}

						});
						

					}else{
						
						console.log(err);
						callback(404,{'Error':'User not found'});
					}

				});
		}
		

	}else{

		let errorObject = [];

				if(!provider){
					errorObject.push('provider is a required field');
				}
				if(!email){
					errorObject.push('email is a required field');
				}
				if(!password){
					errorObject.push('password is a required field');
				}
				console.log(errorObject);

	}
}

module.exports = login;