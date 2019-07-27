'use strict';

const helpers = require('./../lib/helpers');
const mailer = require('./mailer');
const models = require('./../models/index');
const token = require('./../controllers/tokens');

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

	let initialProvider = data.payload.provider;
	let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? 1 : false;
	let provider = typeof(data.payload.provider) == 'string' && (data.payload.provider == 'email' || data.payload.provider == 'facebook' || data.payload.provider == 'twitter' || data.payload.provider == 'linkedin' || data.payload.provider == 'google'  ) ? data.payload.provider : false;


	if(provider){

		if(provider == 'email'){

		let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
		let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
		let email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length >= 10 ? data.payload.email.trim() : false;
	 	let dob = typeof(data.payload.dob) == 'string' ? data.payload.dob.trim() : false;

	 	if(password && email && phone && dob){

			let hashedPassword = helpers.hash(password);

			let data = {
				phone: phone,
				email: email,
				dob: dob,
				password: hashedPassword,
				provider: provider
			}
			//TODO:use transaction here

			 models.User
				.findOrCreate({where: {phone: phone,email:email}, defaults: data })
				.then(([user, created]) => {					
					
					if(created){
						//create token here
						token.generate(user.id).then(([accessToken, created]) => {

							if(created){
								//TODO: Send Email
								callback(200,{user,accessToken});				 
							}else{
								callback(500,{'Error':'User already'});
							}
							
						 });
						
					}else {
						callback(400,{'Error':'User Already exists'});
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

	let tokenParam = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuid = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;
	let query = data.queryStringObject;
	 
	let param = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	
	let page = typeof(query.page) == 'string'  ? query.page : 1; 
	let limit = typeof(query.limit) == 'string' ? query.limit : 10;
	let sort = typeof(query.sort) == 'string' && query.sort.trim().length > 0 && (query.sort.trim() == 'ASC' || 'DESC') ? query.sort.trim() : 'DESC';


	if(tokenParam && uuid){

		token.verify(uuid,tokenParam).then((result)=>{
			
			if(!result){
				callback(400,{'Error':'Token Mismatch or expired'});
			}			
		})
		.then(()=>{
						
			if(param){
				models.User.findOne({where: {id:param},include:[{model:models.Token}]}).then(user=>callback(200,{user}));
			}else {
				models.User.findAndCountAll({ offset: page, limit: limit, order: [['createdAt', sort]],include:[{model:models.Token},{model:models.Profile}]}).then((users)=>callback(200,{users}));
			}

		}).catch((err)=>{
			//TODO: This should be optimzed
			console.log(err);
			callback(500,err);
		})	;		

	}
}

module.exports = users;
