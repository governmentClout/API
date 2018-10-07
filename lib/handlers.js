const _db = require('./db');
const helpers = require('./helpers');
const uuid = require('uuid/v1');
const config = require('./config');
const mysql = require('mysql');

let handlers = {};

const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name

});

handlers.notFound = (data,callback)=>{
	callback(404,{'Error':'EndPoint not found'});
}

handlers.users = (data,callback)=>{
	
	let acceptableMethods = ['post','get','put','delete'];
	// console.log('data from here ', data);
	if(acceptableMethods.indexOf(data.method) > -1){

		handlers._users[data.method](data,callback);

	}else{

		callback(405);

	}
}

handlers._users = {};

handlers._users.post = (data,callback)=>{
	// console.log('data not here ', data);
	// console.log('phone : ' + data.payload.phone + ' email ' + data.payload.email + ' password ' + data.payload.password + ' dob ' + data.payload.dob + ' agreement ' + data.payload.tosAgreement + ' provider ' + data.payload.provider);

	let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
	let email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length >= 10 ? data.payload.email.trim() : false;
	let dob = typeof(data.payload.dob) == 'string' ? data.payload.phone.trim() : false;
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
		console.log('Here now -- Point 0');
		// const test = _db.exists('users','phone', phone);
		const test = false;

			if(!test){
				//this means the player does not already exists
				console.log('Here now -- Point 1');
				let hashedPassword = helpers.hash(password);
				console.log('Player does not already exist');
				
				if(hashedPassword){

					let sql = "INSERT INTO users (uuid,phone, email, dob, password, tosAgreement, provider) VALUES ( '" + uuid() + "','" +phone+ "', '" + email + "' , '" + dob +"' ,'"+hashedPassword +"', '" + tosAgreement + "','" + provider +"' )";

					// const createUser = con.query(sql);

					con.query(sql,  (err,result) => {

						console.log('Here now -- Point 2');

					   	if(!err){

					   		console.log(result);
					   		callback(200, {'Success':'User created'});

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
				console.log('Player does already exist');
				callback(400, {'Error':'User with that phone number already exists'})
			}
		}

	// }else{
	// 	console.log('phone : ' + phone + ' email ' + email + ' password ' + password + ' dob ' + dob + ' agreement ' + tosAgreement + ' provider ' + provider);
	// 	callback(400,{'Error':'Missing required data'});
	// }
};

// handlers._users.get = (data,callback)=>{

// 	let phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length >= 10 ? data.queryStringObject.phone : 'false';

// 	if(phone){
// 		_data.read('users',phone, (err,data)=>{

// 			if(!err && data){
// 				delete data.hashedPassword;
// 				callback(200,data);
// 			}else{
// 				callback(404);
// 			}

// 		})
// 	}else{
// 		callback(400,{'Error':'Missing Required Field'});
// 	}
// };

// handlers._users.put = (data,callback)=>{

// 	let phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length >= 10 ? data.queryStringObject.phone : 'false';
// 	let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
// 	let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
// 	let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
// 	let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
	
// 	if( phone && firstName || lastName || password ){

// 		_data.read('users',phone,(err,userData)=>{
// 			if(!err && userData){

// 				if(firstName){
// 					userData.firstName = firstName;
// 				}

// 				if(lastName){
// 					userData.lastName = lastName;
// 				}
				
// 				if(password){
// 					userData.hasedPassword = helpers.hash(password);
// 				}

// 				_data.update('users',phone,userData,(err)=>{
// 					if(!err){
// 						callback(200,{'Success':'User Updated'});
// 					}else{
// 						console.log(err);
// 						callback(500,{'Error': 'Could not update the user'});
// 					}
// 				})
// 			}
// 		});

// 	}else{

// 	} 
// };

// handlers._users.delete = (data,callback)=>{

// 	let phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length >= 10 ? data.queryStringObject.phone : 'false';

// 	if(phone){
// 		_data.read('users',phone, (err,data)=>{

// 			if(!err && data){

// 				_data.delete('users',phone, (err)=>{
// 					if(!err){
// 						callback(200,{'Success':'User deleted'});
// 					}else{
// 						console.log(err);
// 						callback(500,{'Error':'User could not be deleted'});
// 					}
// 				});

// 			}else{
// 				callback(400,{'Error':'Could not find the user'});
// 			}

// 		})
// 	}else{
// 		callback(400,{'Error':'Missing Required Field'});
// 	}

// };

// handlers.tokens = (data,callback)=>{
	
// 	let acceptableMethods = ['post','get','put','delete'];

// 	if(acceptableMethods.indexOf(data.method) > -1){

// 		handlers._tokens[data.method](data,callback);

// 	}else{

// 		callback(405);

// 	}
// }

// handlers._tokens = {};


// handlers._tokens.post = (data, callback)=>{
// 	let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
// 	let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

// 	if(phone && password){

// 		_data.read('users',phone,(err,userData)=>{

// 			if(!err && userData){

// 				let hashedPassword = helpers.hash(password);

// 				if(hashedPassword == userData.hashedPassword){

// 					let tokenID = helpers.createRandomString(20);
// 					let expires = Date.now() + 1000 * 60 * 60;

// 					let tokenObject = {
// 						'phone': phone,
// 						'id': tokenID,
// 						'expires': expires
// 					}

// 					_data.create('tokens',tokenID,tokenObject,(err)=>{

// 						if(!err){

// 							callback(200,tokenObject);

// 						}else{

// 							console.log(err);
// 							callback(500, {'Error': 'Could not create token'});

// 						}
// 					});

// 				}else{
// 					callback(400,{'Error':'Could not authenticate user'})
// 				}

// 			}else{

// 				callback(400,{'Error':'Could not find user'});

// 			}
// 		})

// 	}else{
// 		callback(400,{'Error':'Missing required fields'})
// 	}
// }

// handlers._tokens.get = (data, callback)=>{

// 	let id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id : false;

// 	if(id){

// 		_data.read('tokens',id,(err,tokenData)=>{

// 			if(!err && tokenData){

// 				callback(200,tokenData);

// 			}else{

// 				console.log(err);
// 				callback(500,{'Error':'Could not retrieve Token'});

// 			}
// 		});
// 	}else{
// 		callback(400,{'Error':'Missing Required Fields'});
// 	}
// }

// handlers._tokens.put = (data, callback)=>{

// 	let id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id : false;
// 	let extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? data.payload.extend : false;

// 	if(id && extend){

// 		_data.read('tokens',id,(err,tokenData)=>{

// 			if(!err && tokenData){

// 				// console.log(tokenData);

// 				if(tokenData.expires > Date.now()){
					
// 					tokenData.expires = Date.now() + 1000 * 60 * 60;
					
// 					_data.update('tokens',id,tokenData, (err)=>{

// 						if(!err){
// 							callback(200,{'Success':'Token Updated'});
// 						}else{
// 							callback(500,{'Error':'Token Update Failed'});
// 						}

// 					});

// 				}else{
// 					callback(400,{'Error':'Token already expired'});
// 				}

// 			}else{
// 				callback(500,{'Error':'Could not read token file'});
// 			}

// 		});

// 	}else{
// 		callback(300,{'Error':'Missing Required Fields'});
// 	}
// }

// handlers._tokens.delete = (data, callback)=>{

// 	let id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : 'false';

// 	if(id){
// 		_data.read('tokens',id, (err,data)=>{

// 			if(!err && data){

// 				_data.delete('tokens',id , (err)=>{
// 					if(!err){
// 						callback(200,{'Success':'Token deleted'});
// 					}else{
// 						console.log(err);
// 						callback(500,{'Error':'Token could not be deleted'});
// 					}
// 				});

// 			}else{
// 				callback(400,{'Error':'Could not find the token'});
// 			}

// 		})
// 	}else{
// 		callback(400,{'Error':'Missing Required Field'});
// 	}

// }

// handlers._tokens.verify = (id,phone,callback)=>{
	
// }


module.exports = handlers;