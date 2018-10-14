const _db = require('./db');
const helpers = require('./helpers');
const uuidV1 = require('uuid/v4');
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


handlers.notFound = (data,callback)=>{
	callback(404,{'Error':'EndPoint not found'});
}

handlers.users = (data,callback)=>{
	
	let acceptableMethods = ['post','get','put','delete','options'];
	// console.log('data from here ', data);
	if(acceptableMethods.indexOf(data.method) > -1){
		// console.log('Method HERE : ' + data.method);
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
	let uuid = uuidV1();
	
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

	//get all user things, profile and user tables content, expects uuid and required headers
	callback(200,{'Success':'You have hit the user get endpoint'});

}



handlers.login = (data,callback)=>{
	
	let acceptableMethods = ['post','options'];
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
						// console.log('Token: ' + tokenResult);
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
	
	let acceptableMethods = ['post','get','put','options'];
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

				let profile = "SELECT nationality,state,lga,firstName,lastName,photo,created_at,updated_at FROM profiles WHERE uuid='" + uuidHeader + "'";
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
									// console.log(result);
									if(!err && 
										result.length > 0
										){

										let updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
									

										let sql = "UPDATE profiles SET nationality='" + nationality + "', state ='"+state+"', lga ='"+lga+"', firstName='"+firstName+"', lastName='"+lastName+"',updated_at='"+updated_at.toString()+"' WHERE uuid='" +uuid+ "'"; 

										con.query(sql,  (err,result) => {

										   	if(!err){

										   		callback(200, {'Success':'Profile Update Done'});

										   	}else{
										   		console.log(err);
										   		callback(400, {'Error':'Profile Update Failed'});
										   		// callback(500, {'Error':'Table creation failed, its possible this table already exists'});
										   	}

								 		});

									}else{
										callback(404,{'Error':'User profile not found, please create a profile'});
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

}

handlers.posts = (data,callback)=>{
	
	let acceptableMethods = ['post','get','put','delete','options'];
	// console.log('data from here ', data);
	if(acceptableMethods.indexOf(data.method) > -1){

		handlers._posts[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers._posts = {};

handlers._posts.post = (data,callback)=>{
	//create a new post

	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid;

	let post = typeof(data.payload.post) == 'string' && data.payload.post.trim().length > 0 ? data.payload.post.trim() : false;
	let location = typeof(data.payload.location) == 'string' && data.payload.location.trim().length > 0 ? data.payload.location.trim() : 'unspecified';
	let attachment = typeof(data.payload.attachment) == 'object' && data.payload.attachment.length > 0  ? data.payload.attachment : null;
	let user = typeof(uuidHeader) == 'string' && uuidHeader.trim().length > 0 ? uuidHeader.trim() : false;
	let uuid = uuidV1();
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;

	if(token && user){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

		con.query(verifyToken, (err,result)=>{
			console.log('token posts ' + result);
			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){

					if(post){

						if(attachment){
							attachment = JSON.stringify(attachment);
						}

						let sql = "INSERT INTO posts (post,location,attachment,uuid,user) VALUES('"+post+"','" + location+"','"+attachment+"','"+uuid+"','"+user+"')";

						con.query(sql,(err,result)=>{

							if(!err && result){

								callback(200,{'Success':'Post Created'});

							}else{
								console.log(err);
								callback(500,{'Error':'Post not created, something went wrong'});

							}

						});

					}else{
						callback(405,{'Error':'Missing Required Parameter'});
					}


			}else{
				callback(400,{'Error':'Token Mismatch or expired'});
			}

		});
	}else{
			callback(400,{'Error':'Missing Header Parameters'});
	}	

}

handlers._posts.get = (data,callback)=>{
	
	let post = typeof(data.queryStringObject.post) == 'string' && data.queryStringObject.post.trim().length > 0 ? data.queryStringObject.post.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;
	
	if(data && 
		token && 
		uuidHeader &&
		post 
		){

		let headerChecker = "SELECT * FROM tokens WHERE uuid='" + uuidHeader + "'";
		
		con.query(headerChecker,(err,results)=>{
			// console.log(results[0].token);
			if(!err && 
				results && 
				results[0].token.length > 0){

				let postQuery = "SELECT post,attachment,location,uuid,created_at,updated_at FROM posts WHERE uuid='" + post + "'";
			// console.log('uuid ' + uuidHeader);
				con.query(postQuery,(err,result)=>{
					
					if(!err && result[0]){

						callback(200,{'post':result});

					}else{
						console.log(err);
						callback(404,{'Error':'Post not found'});
					}

				})

			}else{
				console.log(err);
				callback(404,{'Error':'Token Invalid or Expired'});
			}

		});

	}else{

		callback(400,{'Error':'Missing Required Fields'});
	}
}

handlers._posts.put = (data,callback)=>{
	//create a new post
	callback(200,{'Success':'You have hit posts put endpoint'});
}

handlers._posts.delete = (data,callback)=>{
	//get a user profile
	let post = typeof(data.queryStringObject.post) == 'string' && data.queryStringObject.post.trim().length > 0 ? data.queryStringObject.post.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;
	// console.log('uuidQuery',data.queryStringObject.uuid);

	if(data && 
		token && 
		uuidHeader &&
		post 
		){

		let headerChecker = "SELECT * FROM tokens WHERE uuid='" + uuidHeader + "'";
		
		con.query(headerChecker,(err,results)=>{
			// console.log(results[0].token);
			if(!err && 
				results && 
				results[0].token.length > 0){

				let postQuery = "SELECT count(*) FROM posts WHERE uuid='" + post + "'";
			
				con.query(postQuery,(err,result)=>{

					if(!err && result[0]){

						let deletePost = "DELETE FROM posts WHERE uuid='"+post+"'";

						con.query(deletePost,(err,result)=>{

							if(!err){
								callback(200,{'Success':'Post Deleted'});
							}else{
								console.log(err);
								callback(500,{'Error':'Post not deleted, something went wrong'});
							}

						});

					}else{
						console.log(err);
						callback(404,{'Error':'Post not found'});
					}

				})

			}else{
				console.log(err);
				callback(404,{'Error':'Token Invalid or Expired'});
			}

		});

	}else{

		callback(400,{'Error':'Missing Required Fields'});
	}
}

handlers.comments = (data,callback)=>{
	
	let acceptableMethods = ['post','get','put','delete','options'];
	// console.log('data from here ', data);
	if(acceptableMethods.indexOf(data.method) > -1){

		handlers._comments[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers._comments = {};

handlers._comments.post = (data,callback)=>{
	//create a new post

	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid;

	let comment = typeof(data.payload.comment) == 'string' && data.payload.comment.trim().length > 0 ? data.payload.comment.trim() : false;
	let ref = typeof(data.payload.ref) == 'string' && data.payload.ref.trim().length > 0 ? data.payload.ref.trim() : false;
	let user = typeof(uuidHeader) == 'string' && uuidHeader.trim().length > 0 ? uuidHeader.trim() : false;
	let uuid = uuidV1();
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;

	if( token && user && ref ){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

		con.query(verifyToken, (err,result)=>{
			
			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){

					if(comment && user){

						let sql = "INSERT INTO comments (user,comment,ref) VALUES('"+user+"','" + comment+"','"+ref+"')";

						con.query(sql,(err,result)=>{

							if(!err && result){

								callback(200,{'Success':'Comment Posted'});

							}else{
								console.log(err);
								callback(500,{'Error':'Comment Not Posted, something went wrong'});

							}

						});

					}else{
						callback(405,{'Error':'Missing Required Parameter'});
					}


			}else{
				callback(400,{'Error':'Token Mismatch or expired'});
			}

		});
	}else{
			callback(400,{'Error':'Missing Header Parameters'});
	}	

}

module.exports = handlers;