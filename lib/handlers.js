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
		
		const check = "SELECT * FROM users WHERE phone='" + phone + "'";
		

		con.query(check,  (err,result) => {

						console.log('result ' + result.length);

					   	if(!err && result.length == 0){

					   		
						let hashedPassword = helpers.hash(password);
						
						
						if(hashedPassword){

							let sql = "INSERT INTO users (uuid,phone, email, dob, password, tosAgreement, provider) VALUES ( '" + uuid() + "','" +phone+ "', '" + email + "' , '" + dob +"' ,'"+hashedPassword +"', '" + tosAgreement + "','" + provider +"' )";

							// const createUser = con.query(sql);

							con.query(sql,  (err,result) => {

							   	if(!err){

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
					   		console.log(err);
					   		callback(400, {'Error':'User Not created, user already exists'});
					   		// callback(500, {'Error':'Table creation failed, its possible this table already exists'});
					   	}

					  });


			
		}else{
				console.log('Player does already exist');
				callback(400, {'Error':'User with that phone number already exists'})
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

		callback(405);

	}
}

handlers._login = {};

handlers._login.post = (data,callback)=>{

	let email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length >= 10 ? data.payload.email.trim() : false;
	let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

	if(email && password){

		let hashedPassword = helpers.hash(password);

		const login = "SELECT * FROM users WHERE email='" + email + "' AND password='" + hashedPassword + "'";
		

		con.query(login,  (err,result) => {

			if(!err && result){

				callback(200,result);

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

		callback(405);

	}
}

handlers._profiles = {};

handlers._profiles.post = (data,callback)=>{

//check header here

	let nationality = typeof(data.payload.nationality) == 'string' && data.payload.nationality.trim().length >= 3 ? data.payload.nationality.trim() : false;
	let state = typeof(data.payload.state) == 'string' && data.payload.state.trim().length >= 2 ? data.payload.state.trim() : false;
	let lga = typeof(data.payload.lga) == 'string' && data.payload.lga.trim().length >= 2 ? data.payload.lga.trim() : false;
	let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	let photo = typeof(data.payload.photo) == 'string' && data.payload.photo.trim().length > 0 ? data.payload.photo.trim() : false;
	let uuid = typeof(data.payload.uuid) == 'string' && data.payload.uuid.trim().length > 0 ? data.payload.uuid.trim() : false;

	if(
		nationality &&
		state &&
		lga &&
		firstName &&
		lastName && 
		photo &&
		uuid

		){

		//check if user exists

		const checkUser = "SELECT * FROM users WHERE uuid='" + uuid + "'";
		

			con.query(checkUser,  (err,result) => {

				//check if profule already exist
				console.log(' result ' + result);
				if(!err && result.length > 0){

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
					callback(404,{'Error':'User not found'});
				}

			});

			

		}else{
			callback(400,{'Error':'Missing required Parameter'});
		}

	// callback(200,{'Success':'You have hit profile post endpoint'});
}


handlers._profiles.get = (data,callback)=>{

	callback(200,{'Success':'You have hit profile get endpoint'});
}

handlers._profiles.put = (data,callback)=>{

	callback(200,{'Success':'You have hit profile put endpoint'});
}




module.exports = handlers;