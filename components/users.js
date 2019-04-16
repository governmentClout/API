const _db = require('./../lib/migrations');
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');
const tokens = require('./../lib/tokenization');
const mailer = require('./mailer');

const con = mysql.createPool({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name,
  multipleStatements: true

});


let users = {};


users.options = (data,callback)=>{

	callback(200,data.headers);
	
}

/**
 * @api {post} /users Create User (Email)
 * @apiName createUser
 * @apiGroup Users
 * @apiDescription The endpoint creates a new user using Email provider
 * @apiParam {phone} phone User Phone number.
 * @apiParam {String} email User Email address.
 * @apiParam {String} password User Password.
 * @apiParam {String} dob User Date of Birth.
 * @apiParam {Boolean} tosAgreement TOS Agreement.
 * @apiParam {String} provider User method of signup, either email, or any of the social media (twitter|facebook|linkedin|google).
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *{
 * 	"Token": "UX4LmqktGgC7Ilib9qmpHTRnYxEjr7eMTiD6QUUhRSHI70nT482boFClYmB7FmM7ulcgqcE388grQLUg9IfD2Ol9mPPqM8kImoFF",
 * 	"uuid": "055e8860-cbe9-11e8-98f8-4fae0909dc0e"
 *}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 400 Bad Request
 *{
 *  "Error": "Provider is required"
 *}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 401 Bad Request
 *{
 *"Error": [
 * 	"Phone number is missing or invalid format",
 *	"Email is missing or invalid format",
 *	"DOB is missing or invalid format",
 *	"Password is missing or invalid format",
 *	"tosAgreement cannot be false"
 *],
 *	"Message": []
 *}
 */

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
	
	if(provider){

		if(provider == 'email'){

		let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
		let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
		let email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length >= 10 ? data.payload.email.trim() : false;
	 	let dob = typeof(data.payload.dob) == 'string' ? data.payload.dob.trim() : false;

	 	if(tosAgreement && password && email && phone && dob){

	 		const checkPhone = "SELECT * FROM users WHERE phone='" + phone + "'";
		

			con.query(checkPhone,  (err,result) => {
				
				   	if(!err && result.length == 0){

				   		const checkEmail = "SELECT * FROM users WHERE email='" + email + "'";

				   		con.query(checkEmail,  (err,result) => {

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
										   				console.log('done');
										   				//send email here
										   				mailer.sendByEmail({
										   					'email':email,
										   					'subject':'Welcome to GClout',
										   					'message':'Your registration was successful, welcome to gclout.com'
										   					});

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
											console.log(err);
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

				callback(400, {'Error': errorObject, 'Message': errorMessage});
		

	 	}
	 }

	 else if(
	 	provider == "twitter" || 
	 	provider == "facebook" || 
	 	provider == "linkedin" || 
	 	provider == "google" 

	 	){

	 	if(tosAgreement){

		let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length > 0 ? data.payload.phone.trim() : '';
		let email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : '';
	 	let dob = typeof(data.payload.dob) == 'string' ? data.payload.dob.trim() : '';

	 	let testPhone = "SELECT * FROM users WHERE phone='" + phone + "' AND phone !='' AND phone != 'false' ";

	 	con.query(testPhone,(err,resultPhone)=>{

	 		if(!err && resultPhone.length == 0){

	 			let testEmail = "SELECT * FROM users WHERE email='" +email+ "' AND email !='' AND email != 'false'";
	 			
	 			con.query(testEmail,(err,resultEmail)=>{
	 				
	 				if(!err && resultEmail.length == 0){

	 					let insertUser = "INSERT INTO users (uuid,phone, email, dob, password, tosAgreement, provider) VALUES ( '" + uuid + "','" +phone+ "', '" + email + "' , '" + dob +"' ,'NULL', '" + tosAgreement + "','" + provider +"' )";

	 					con.query(insertUser,(err,result)=>{
	 						
	 						if(!err){
	 							
	 							let userToken = tokens.generate(uuid);

								let tokenInsert = "INSERT INTO tokens (uuid,token) VALUES ('" + uuid +"','" + userToken + "')";

								con.query(tokenInsert,(err,result)=>{

						   			if(!err){
						   				mailer.sendByEmail({
								   					'email':email,
								   					'subject':'Welcome to GClout',
								   					'message':'Your registration was successful, welcome to gclout.com'
								   					});
						   				callback(200, {'Token':userToken, 'uuid':uuid});

						   			}else{

						   				callback(500, {'Error':'User registration failed, token generation failed'});

						   			}

						   		});

	 						}else{
	 							callback(500,{'Error':'Server error (i.e. xyluz did something wrong fault)'});
	 						}

	 					});

	 				}else{	
	 					callback(400,{'Error':'Email already in use'});
	 				}

	 			});

	 		}else{
	 			callback(400,{'Error':'Phone already in use'});
	 		}

	 	});


	 	}else{
	 		callback(400,{'Error':'tosAgreement must be true'});
	 	}

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

		callback(400, {'Error': errorObject, 'Message': errorMessage});

	 }

	}else{

		callback(400, {'Error': 'Provider is required'});

	}	


}


users.get = (data,callback) => {


	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuid = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;
	let query = data.queryStringObject;

	console.log('query',query);
	
	let param = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	console.log('param',param);
	
	let page = typeof(data.queryStringObject.page) == 'string'  ? data.queryStringObject.page : '1'; 
	let limit = typeof(data.queryStringObject.limit) == 'string' ? data.queryStringObject.limit : '10';
	let sort = typeof(data.queryStringObject.sort) == 'string' && data.queryStringObject.sort.trim().length > 0 && (data.queryStringObject.sort.trim() == 'ASC' || 'DESC') ? data.queryStringObject.sort.trim() : 'DESC';

	if(token && uuid){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + uuid + "'";

		con.query(verifyToken, (err,result)=>{
			console.log('result ' + result);
			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){

				let check = "SELECT users.id,users.uuid,users.email,users.dob,users.phone,profiles.nationality_residence,profiles.nationality_origin,profiles.state,profiles.lga,profiles.firstName,profiles.lastName,profiles.photo FROM users LEFT JOIN profiles ON (users.uuid=profiles.uuid)";

				if(param){
					
					check = "SELECT users.id,users.uuid,users.email,users.dob,users.phone,profiles.nationality_residence,profiles.nationality_origin,profiles.state,profiles.lga,profiles.firstName,profiles.lastName,profiles.photo FROM users LEFT JOIN profiles ON (users.uuid=profiles.uuid) WHERE users.uuid='"+param+"'";
				}

						if(sort){
					    		check += " ORDER BY id " + sort;
 					    	}

					    	if(limit){
					    		check += " LIMIT " + limit;
					    	}

					    	if(page){
					    		
					    		let skip = page == '1' ? 0 : page * limit;
					    		check += " OFFSET " + skip;

					    	}
		

					con.query(check,  (err,result) => {

					   	if(!err && result.length > 0){

					   		callback(200,result);

					   	}else{
					   		console.log(err);
					   		callback(500,{'Error':'sql server error, could not fetch users'});

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
