

const _db = require('./../lib/db');
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


	let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
	let email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length >= 10 ? data.payload.email.trim() : false;
	let dob = typeof(data.payload.dob) == 'string' ? data.payload.dob.trim() : false;
	let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? 1 : false;
	let provider = typeof(data.payload.provider) == 'string' ? data.payload.provider : false;
	let uuid = uuidV1();
	let errorObject = {};
	
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
				   		
				   	}

				  });


			
		}else{
				console.log('Player does already exist');
				callback(400, {'Error':'Missing required parameters'})
			}


}

users.get = (data,callback) => {

	let token = data.headers.token;
	let uuid = data.headers.uuid;
	let query = data.queryStringObject;

	//accepted query
	// [with_comments,with_posts,with_]
	
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
