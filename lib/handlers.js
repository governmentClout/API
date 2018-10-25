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

	let token = data.headers.token;
	let uuid = data.headers.uuid;
	
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
	// let uuidQuery = typeof(data.queryStringObject.uuid) == 'string' && data.queryStringObject.uuid.trim().length > 0 ? data.queryStringObject.uuid.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;
	let uuidQuery = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;

	if(data && 
		token && 
		uuidHeader &&
		uuidQuery == uuidHeader
		){

		let headerChecker = "SELECT * FROM tokens WHERE uuid='" + uuidHeader + "'";
		
		con.query(headerChecker,(err,results)=>{

			if(!err && 
				results && 
				results[0].token.length > 0){

				console.log('yes now');

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
	let uuid = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;

	if(token && uuid){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + uuid + "'";

		con.query(verifyToken, (err,result)=>{

			if(
				!err && 
				result[0] && 
				result[0].token == token 

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
										let nationality = typeof(data.payload.nationality) == 'string' && data.payload.nationality.trim().length >= 3 ? data.payload.nationality.trim() : result[0].nationality;
										let state = typeof(data.payload.state) == 'string' && data.payload.state.trim().length >= 2 ? data.payload.state.trim() : result[0].state;
										let lga = typeof(data.payload.lga) == 'string' && data.payload.lga.trim().length >= 2 ? data.payload.lga.trim() : result[0].lga;
										let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : result[0].firstName;
										let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : result[0].lastName;
										let photo = typeof(data.payload.photo) == 'string' && data.payload.photo.trim().length > 0 ? data.payload.photo.trim() : result[0].photo;


										let updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
									

										let sql = "UPDATE profiles SET nationality='" + nationality + "', state ='"+state+"', lga ='"+lga+"', firstName='"+firstName+"', lastName='"+lastName+"',updated_at='"+updated_at.toString()+"' WHERE uuid='" +uuid+ "'"; 

										con.query(sql,  (err,result) => {

										   	if(!err){
										   		console.log(result);
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
	let post_type = typeof(data.payload.post_type) == 'object' && data.payload.attachment.post_type > 0  ? data.payload.post_type : 'post';
	let user = typeof(uuidHeader) == 'string' && uuidHeader.trim().length > 0 ? uuidHeader.trim() : false;
	let uuid = uuidV1();
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;

	if(token && user){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

		con.query(verifyToken, (err,result)=>{
			
			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){

					if(post){

						if(attachment){
							attachment = JSON.stringify(attachment);
						}

						let sql = "INSERT INTO posts (post,location,attachment,uuid,user,post_type) VALUES('"+post+"','" + location+"','"+attachment+"','"+uuid+"','"+user+"','"+post_type+"')";

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
	
	// let post = typeof(data.queryStringObject.post) == 'string' && data.queryStringObject.post.trim().length > 0 ? data.queryStringObject.post.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;
	let post = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;

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

				let postQuery = "SELECT * FROM posts WHERE uuid='" +post+"'";
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

	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid;
	// let uuid = typeof(uuidHeader) == 'string' && uuidHeader.trim().length > 0 ? uuidHeader.trim() : false;
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;
	let postuuid = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	// console.log(data);
	if(token && postuuid){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + uuidHeader + "'";

		con.query(verifyToken, (err,result)=>{

			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){
				// console.log('post content ' + post);
					let checkPost = "SELECT * FROM posts WHERE uuid='" + postuuid + "'";

					con.query(checkPost, (err,result)=>{
						// console.log(result);
						if(!err && 
							result.length > 0
							
							){
							
							let post = typeof(data.payload.post) == 'string' && data.payload.post.trim().length > 0 ? data.payload.post.trim() : result[0].post;
							let post_type = typeof(data.payload.post_type) == 'string' && data.payload.post_type.trim().length > 0 ? data.payload.post_type.trim() : result[0].post;
							let location = typeof(data.payload.location) == 'string' && data.payload.location.trim().length > 0 ? data.payload.location.trim() : result[0].location;
							let attachment = typeof(data.payload.attachment) == 'object' && data.payload.attachment.length > 0  ? JSON.stringify(data.payload.attachment) : result[0].attachment;

							let updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
						

							let sql = "UPDATE posts SET post='" + post + "', location ='"+location+"', attachment ='"+attachment+"',post_type='"+post_type+"', updated_at='"+updated_at.toString()+"' WHERE uuid='" +postuuid+ "'"; 

							con.query(sql,  (err,result) => {

							   	if(!err){
							   		console.log(result);
							   		callback(200, {'Success':'Post Update Done'});

							   	}else{
							   		console.log(err);
							   		callback(400, {'Error':'Post Update Failed'});
							   		// callback(500, {'Error':'Table creation failed, its possible this table already exists'});
							   	}

					 		});

						}else{
							callback(404,{'Error':'Post not found'});
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
								let deleteComments = "DELETE FROM comments WHERE ref='"+post+"'";
								//delete all comments on this
								con.query(deleteComments,(err,result)=>{
									if(err){
										callback(200,{'Success':'Post and all associated comments deleted'});
									}else{
										callback(500,{'Error':'Post comments not deleted, something went wrong'});
									}
								})
								
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

handlers._comments.get = (data,callback)=>{
	
	let comment = typeof(data.queryStringObject.comment) == 'string' && data.queryStringObject.comment.trim().length > 0 ? data.queryStringObject.comment.trim() : false;
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

				let postQuery = "SELECT comment,user,uuid,created_at,updated_at FROM comments WHERE uuid='" + comment + "'";
			// console.log('uuid ' + uuidHeader);
				con.query(postQuery,(err,result)=>{
					
					if(!err && result[0]){

						callback(200,{'comment':result});

					}else{
						console.log(err);
						callback(404,{'Error':'Comment not found'});
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

handlers._comments.put = (data,callback)=>{
	callback(200,{'Success':'You have hit the comment put endpoint'});
}

handlers._comments.delete = (data,callback)=>{
	
	//get a user profile
	let comment = typeof(data.queryStringObject.comment) == 'string' && data.queryStringObject.comment.trim().length > 0 ? data.queryStringObject.comment.trim() : false;
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

				let commentQuery = "SELECT count(*) FROM comments WHERE uuid='" + comment + "'";
			
				con.query(commentQuery,(err,result)=>{

					if(!err && result[0]){

						let deleteComment = "DELETE FROM comments WHERE uuid='"+comment+"'";

						con.query(deleteComment,(err,result)=>{

							if(!err){
								
								callback(200,{'Success':'Comment Deleted'});
								
							}else{
								console.log(err);
								callback(500,{'Error':'Comment not deleted, something went wrong'});
							}

						});

					}else{
						console.log(err);
						callback(404,{'Error':'Comment not found'});
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

handlers.reactions = (data,callback)=>{
	
	let acceptableMethods = ['post','delete','options'];
	// console.log('data from here ', data);
	if(acceptableMethods.indexOf(data.method) > -1){

		handlers._reactions[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers._reactions = {};

// "CREATE TABLE IF NOT EXISTS " + config.db_name + ".reaction ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , post VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT NOT NULL DEFAULT '1' , PRIMARY KEY (id)) ENGINE = InnoDB;"

handlers._reactions.post = (data,callback)=>{

	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid;
	let post = typeof(data.payload.post) == 'string' && data.payload.post.trim().length > 0 ? data.payload.post.trim() : false;
	let uuid = uuidV1();

	if( token && user && ref ){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

		con.query(verifyToken, (err,result)=>{
			
			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){

					if(post){

						let sql = "INSERT INTO reactions (uuid,post) VALUES('"+uuid+"','" + post+"')";

						con.query(sql,(err,result)=>{

							if(!err && result){

								callback(200,{'Success':'Post Liked'});

							}else{
								console.log(err);
								callback(500,{'Error':'Operation Failed'});

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

handlers._reactions.delete = (data,callback)=>{
	//get a user profile
	let reaction = typeof(data.queryStringObject.reaction) == 'string' && data.queryStringObject.reaction.trim().length > 0 ? data.queryStringObject.reaction.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;
	// console.log('uuidQuery',data.queryStringObject.uuid);

	if(data && 
		token && 
		uuidHeader &&
		reaction 
		){

		let headerChecker = "SELECT * FROM tokens WHERE uuid='" + uuidHeader + "'";
		
		con.query(headerChecker,(err,results)=>{
			// console.log(results[0].token);
			if(!err && 
				results && 
				results[0].token.length > 0){

				let reactionQuery = "SELECT count(*) FROM reactions WHERE uuid='" + reaction + "'";
			
				con.query(reactionQuery,(err,result)=>{

					if(!err && result[0]){

						let deleteReaction = "DELETE FROM reactions WHERE uuid='"+reaction+"'";

						con.query(deleteReaction,(err,result)=>{

							if(!err){
								
								callback(200,{'Success':'Reaction Deleted'});
								
							}else{
								console.log(err);
								callback(500,{'Error':'Reaction Deleted'});
							}

						});

					}else{
						console.log(err);
						callback(404,{'Error':'Reaction not found'});
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

module.exports = handlers;