const _db = require('./db');
const helpers = require('./helpers');
const uuidV1 = require('uuid/v1');
const config = require('./config');
const mysql = require('mysql');
const tokens = require('./tokenization');
const util = require('util');

let handlers = {};

const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name

});

let uuid = uuidV1();

handlers.notFound = (data,callback)=>{
	callback(404,{'Error':'EndPoint not found'});
}

handlers.users = (data,callback)=>{
	
	let acceptableMethods = ['post','get','put','delete'];
	// console.log('data from here ', data);
	if(acceptableMethods.indexOf(data.method) > -1){

		handlers._users[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers._users = {};

handlers._users.post = (data,callback)=>{

	let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
	let email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length >= 10 ? data.payload.email.trim() : false;
	let dob = typeof(data.payload.dob) == 'string' ? data.payload.dob.trim() : false;
	let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? 1 : false;
	let provider = typeof(data.payload.provider) == 'string' ? data.payload.provider : false;
	
	
	if(
		phone && 
		email && 
		dob && 
		password && 
		tosAgreement &&
		provider

		){
		
		const check = "SELECT * FROM users WHERE phone='" + phone + "' OR email='" + email +  "'";
		

		con.query(check,  (err,result) => {

					console.log('result ' + result.length);

				   	if(!err && result.length == 0){

				   		
					let hashedPassword = helpers.hash(password);
					
					
					if(hashedPassword){

						let sql = "INSERT INTO users (uuid,phone, email, dob, password, tosAgreement, provider) VALUES ( '" + uuid + "','" +phone+ "', '" + email + "' , '" + dob +"' ,'"+hashedPassword +"', '" + tosAgreement + "','" + provider +"' )";

						// const createUser = con.query(sql);

						con.query(sql,  (err,result) => {

						   	if(!err){
						   		let userToken = tokens.generate(uuid);

						   		let tokenInsert = "INSERT INTO tokens (uuid,token) VALUES ('" + uuid +"','" + userToken + "')"
						   		
						   		con.query(tokenInsert,(err,result)=>{
						   			if(!err){
						   				callback(200, {'Token':userToken, 'uuid':uuid});
						   			}else{
						   				callback(500, {'Error':'User registration failed, token generation failed'});
						   			}
						   			

						   		});


						   	}else{
						   		console.log(err);
						   		callback(400, {'Error':'User Not created'});
						   		// callback(500, {'Error':'Table creation failed, its possible this table already exists'});
						   	}

						  });
			

						}else{
							callback(500, {'Error':'Password Hash Failed'});
						}

				   	}else{
				   		console.log(err);
				   		callback(400, {'Error':'User Not created, user already exists'});
				   		// callback(500, {'Error':'Table creation failed, its possible this table already exists'});
				   	}

				  });


			
		}else{
				console.log('Player does already exist');
				callback(400, {'Error':'Missing required parameters'})
			}


}

handlers._users.get = (data,callback) => {
	//get all user things, profile and user tables content, expects uuid
}



handlers.login = (data,callback)=>{
	
	let acceptableMethods = ['post'];
	// console.log('data from here ', data);
	if(acceptableMethods.indexOf(data.method) > -1){

		handlers._login[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers._login = {};

handlers._login.post = (data,callback)=>{

//check token
	let email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length >= 10 ? data.payload.email.trim() : false;
	let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

	if(email && password){

		let hashedPassword = helpers.hash(password);

		const login = "SELECT uuid,email,phone,dob FROM users WHERE email='" + email + "' AND password='" + hashedPassword + "'";
		

		con.query(login,  (err,result,fields) => {

			if(!err && result.length > 0){

				// console.log('fields ' + fields);

				let verifyToken = "SELECT token FROM tokens WHERE uuid='" + result[0].uuid + "'";
				
				con.query(verifyToken, (err,tokenResult)=>{

					console.log('Token: ' + tokenResult);

					if(
						!err && 
						tokenResult &&
						tokenResult.length > 0 
					){
						console.log('Token: ' + tokenResult);
						callback(200,{'user':result,'token':tokenResult});

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


handlers.profiles = (data,callback)=>{
	
	let acceptableMethods = ['post','get','put'];
	// console.log('data from here ', data);
	if(acceptableMethods.indexOf(data.method) > -1){

		handlers._profiles[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers._profiles = {};

handlers._profiles.post = (data,callback)=>{

//check header here for token, the uuid and token must match what we have in the database and must not have expired
	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid;

	let nationality = typeof(data.payload.nationality) == 'string' && data.payload.nationality.trim().length >= 3 ? data.payload.nationality.trim() : false;
	let state = typeof(data.payload.state) == 'string' && data.payload.state.trim().length >= 2 ? data.payload.state.trim() : false;
	let lga = typeof(data.payload.lga) == 'string' && data.payload.lga.trim().length >= 2 ? data.payload.lga.trim() : false;
	let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	let photo = typeof(data.payload.photo) == 'string' && data.payload.photo.trim().length > 0 ? data.payload.photo.trim() : false;
	let uuid = typeof(uuidHeader) == 'string' && uuidHeader.trim().length > 0 ? uuidHeader.trim() : false;
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;

	if(token && uuid){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + uuid + "'";

		con.query(verifyToken, (err,result)=>{

			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){

				if(
					nationality &&
					state &&
					lga &&
					firstName &&
					lastName && 
					photo 

					){

					const checkUser = "SELECT * FROM users WHERE uuid='" + uuid + "'";
					

						con.query(checkUser,  (err,result) => {

							//check if profule already exist
							console.log(' result ' + result);

							if(!err && result.length > 0){

								let checkProfile = "SELECT * FROM profiles WHERE uuid='" + uuid + "'";

								con.query(checkProfile, (err,result)=>{
									if(!err && 
										result.length < 1
										){

										let sql = "INSERT INTO profiles (uuid, nationality, state, lga, firstName, lastName, photo) VALUES ( '" + uuid + "','" +nationality+ "', '" + state + "' , '" + lga +"' ,'"+firstName +"', '" + lastName + "','" + photo +"' )";

										con.query(sql,  (err,result) => {

										   	if(!err){

										   		callback(200, {'Success':'Profile created'});

										   	}else{
										   		console.log(err);
										   		callback(400, {'Error':'Profile Not created'});
										   		// callback(500, {'Error':'Table creation failed, its possible this table already exists'});
										   	}

								 		});

									}else{
										callback(403,{'Error':'User profile already exists, you should be updating'});
									}
								});

								
							}else{
								callback(404,{'Error':'User not found'});
							}

						});

						

					}else{
						callback(400,{'Error':'Missing required Parameter'});
					}

			}else{
				callback(400,{'Error':'Token Mismatch or expired'});
			}

		});	

	}else{
		callback(400,{'Error':'Token Invalid or expired'});
	}

	

	// callback(200,{'Success':'You have hit profile post endpoint'});
}


handlers._profiles.get = (data,callback)=>{
//get a user profile
	let uuidQuery = typeof(data.queryStringObject.uuid) == 'string' && data.queryStringObject.uuid.trim().length > 0 ? data.queryStringObject.uuid.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;
	// console.log('uuidQuery',data.queryStringObject.uuid);

	if(data && 
		token && 
		uuidHeader &&
		uuidQuery == uuidHeader
		){
		let headerChecker = "SELECT * FROM tokens WHERE uuid='" + uuidHeader + "'";
		
		con.query(headerChecker,(err,results)=>{
			// console.log(results[0].token);
			if(!err && 
				results && 
				results[0].token.length > 0){

				let profile = "SELECT nationality,state,lga,firstName,lastName,photo FROM profiles WHERE uuid='" + uuidHeader + "'";
			// console.log('uuid ' + uuidHeader);
				con.query(profile,(err,result)=>{
					console.log(result);
					if(!err && result[0]){
						callback(200,{'profile':result});
					}else{
						callback(404,{'Error':'User profile not found'});
					}

				})

			}else{
				callback(404,{'Error':'Token Invalid or Expired'});
			}

		});

	}else{
		callback(400,{'Error':'Missing Required Fields'});
	}

	// callback(200,{'Success':'You have hit profile get endpoint'});
}

handlers._profiles.put = (data,callback)=>{
	//update user profile

	callback(200,{'Success':'You have hit profile put endpoint'});
}



module.exports = handlers;