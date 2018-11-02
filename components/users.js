

const _db = require('./../lib/migrations');
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


let users = {};


users.options = (data,callback)=>{

	callback(200,data.headers);
	
}

users.post = (data,callback)=>{


	let phone = null;
	let email = null;
	let dob = null;
	let password = null;
	let initialProvider = data.payload.provider;
	let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? 1 : false;
	let provider = typeof(data.payload.provider) == 'string' && (data.payload.provider == 'email' || data.payload.provider == 'facebook' || data.payload.provider == 'twitter' || data.payload.provider == 'linkedin' || data.payload.provider == 'google'  ) ? data.payload.provider : false;
	let uuid = uuidV1();
	let proceed = false;
	
	if(provider == 'email'){

		password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
		phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
		email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length >= 10 ? data.payload.email.trim() : false;
	 	dob = typeof(data.payload.dob) == 'string' ? data.payload.dob.trim() : false;

	}else{

		phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
		email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length >= 10 ? data.payload.email.trim() : false;
	 	dob = typeof(data.payload.dob) == 'string' ? data.payload.dob.trim() : false;

	}

	if(provider && tosAgreement){

		if(provider == 'email'){

			if(password && phone && email && password && dob){
				proceed = true;
			}

		}else if(
				provider == 'twitter' || 
				provider == 'facebook' ||
				provder == 'linkedin' ||
				provider == 'google'
				){

				proceed = true;

			}

	}
	
	if(proceed){
		
		const checkPhone = "SELECT * FROM users WHERE phone='" + phone + "'";
		

		con.query(checkPhone,  (err,result) => {

				   	if(!err && result.length == 0){

				   		const checkEmail = "SELECT * FROM users WHERE email='" + email + "'";

				   		con.query(checkEmail,  (err,result) => {

				   				if(!err && result.length == 0){

				   					let hashedPassword = 'none';

				   					if(provider == 'email'){
				   						 hashedPassword = helpers.hash(password);
				   					}	
					
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
										   		callback(400, {'Error':'User Not created, mysql error ---> check server log'});
										   		// callback(500, {'Error':'Table creation failed, its possible this table already exists'});
										   	}

										  });
							

										}else{
											callback(500, {'Error':'Password Hash Failed'});
										}

				   				}else{

				   					console.log(err);
				   					callback(400, {'Error':'User Not created, Email already in use'});
				   				
				   				}


				   		});
				   		
					

				   	}else{
				   		console.log(err);
				   		callback(400, {'Error':'User Not created, Phone number already in use'});
				   		
				   	}

				  });
			
		}else{

			let errorObject = [];
			let errorMessage = [];
			let acceptedProviders = ['email','facebook','twitter','linkedin','google'];

			if(!provider){

				errorObject.push('Provider is missing or invalid format');

			}

			if( acceptedProviders.indexOf(provider) == -1 ){
					errorMessage.push('Provider ' + initialProvider + ' is not allowed, try: email | facebook | twitter | linkedin | google');
			}

			if(!phone && provider == "email"){
				errorObject.push('Phone number is missing or invalid format');
				
			}
			if(!email && provider == "email"){
				errorObject.push('Email is missing or invalid format');
			}
			if(!dob && provider == "email"){
				errorObject.push('DOB is missing or invalid format');
			}
			if(!password && provider == "email"){
				errorObject.push('Password is missing or invalid format');
			}
			if(!tosAgreement){
				errorObject.push('tosAgreement cannot be ' + tosAgreement);
			}

				console.log('Player does already exist');

				callback(400, {'Error': errorObject, 'Message': errorMessage});
			}


}

users.get = (data,callback) => {

	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuid = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;
	let query = data.queryStringObject;
	
	let param = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	
	if(token && uuid){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + uuid + "'";

		con.query(verifyToken, (err,result)=>{
			console.log('result ' + result);
			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){

				let check = "SELECT * FROM users";

				if(param){
					check = "SELECT * FROM users WHERE uuid='" + param + "'";
				}
		

					con.query(check,  (err,result) => {

					   	if(!err && result.length > 0){

					   		callback(200,result);

					   	}else{
					   		console.log(err);
					   		callback(500,{'Error':'Could not fetch users'});

					   	}

				   });

				}else{

					callback(400,{'Error':'Token Mismatch or expired'});

				}

		});

	}else{

		callback(400,{'Error':'Token Invalid or expired'});

	}
	

}


module.exports = users;
