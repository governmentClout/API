
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


reactions = {};

reactions.options = (data,callback)=>{

	callback(200,data.headers);
	
}

reactions.post = (data,callback)=>{

	let token = data.headers.token;
	let user = data.headers.uuid;
	let post = typeof(data.payload.post) == 'string' && data.payload.post.trim().length > 0 ? data.payload.post.trim() : false;
	let uuid = uuidV1();

	if( token && user ){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

		con.query(verifyToken, (err,result)=>{
			
			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){

					if(post){
						//check if user already liked post

						let checkLike = "SELECT * from reactions WHERE user='" + user + "' AND post='"+post+"'";

						con.query(checkLike,(err,result)=>{
							
							if(!err && result.length>0){
								//user already liked this post
								callback(400,{'Error':'User already liked this post'});

							}else{

								let sql = "INSERT INTO reactions (uuid,post,user) VALUES('"+uuid+"','" + post+"','"+user+"')";

								con.query(sql,(err,result)=>{

									if(!err && result){

										callback(200,{'Success':'Post Liked'});

									}else{
										
										callback(500,{'Error':'Operation Failed'});

									}

								});

							}

						});

						

					}else{
						let errorObject = [];
						if(!post){
							errorObject.push('Post uuid missing in your request');
						}
						callback(405,{'Error':errorObject});
					}


			}else{
				callback(400,{'Error':'Token Mismatch or expired'});
			}

		});
	}else{
			callback(400,{'Error':'Missing Header Parameters'});
	}	


}

reactions.get = (data,callback)=>{

	let user = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let post = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;

	if(user && token && post){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

		con.query(verifyToken, (err,result)=>{

			if(
				!err && 
				result[0] && 
				result[0].token == token 
				){

				let sqlReactionsCount = "SELECT count(*) AS reactions FROM reactions WHERE post='" +post+ "'";
				con.query(sqlReactionsCount,(err,result)=>{

					if(!err && result){

						callback(200,result);

					}else{

						callback(400,{'Error':err});

					}

				});

			}else{
				console.log(err)
				callback(400,{'Error':'Token/UUID Mismatch or expired'});
			}

		});

	}else{
		let errorObject = [];
		if(!token){
			errorObject.push('Token is invalid');
		}

		if(!user){
			errorObject.push('User UUID invalid');
		}
		if(!post){
			errorObject.push('Post uuid invalid');		
		}
		callback(400,{'Error':errorObject});
	}
}

reactions.delete = (data,callback)=>{
	//get a user profile
	let post = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;

//Take post ID and User ID, delete that record from the database

	if(
		data && 
		token && 
		uuidHeader 

		){

		let headerChecker = "SELECT * FROM tokens WHERE uuid='" + uuidHeader + "'";
		
		con.query(headerChecker, (err,results)=>{
			
			if(
				!err && 
				results && 
				results[0].token.length > 0 &&
				results[0].token == token 

				){

				let reactionQuery = "SELECT count(*) FROM reactions WHERE user='" + uuidHeader + "' AND post='"+post+"'";
			
				con.query(reactionQuery, (err,result)=>{

					if(!err && result[0]){

						let deleteReaction = "DELETE FROM reactions WHERE post='"+post+"' AND user='"+uuidHeader+"'";

						con.query(deleteReaction,(err,result)=>{

							if(!err){
								
								callback(200,{'Success':'Reaction Deleted'});
								
							}else{
								console.log(err);
								callback(500,{'Error':'Reaction not deleted'});
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

		callback(400,{'Error':'Missing Header Fields'});
	}
}


module.exports = reactions;
