
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');
const tokens = require('./../lib/tokenization');



const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name,
  multipleStatements: true

});


// var wrapper = require('node-mysql-wrapper'); 
// var db = wrapper.wrap(connection);


let posts = {};
let resultObject = [];

posts.options = (data,callback)=>{

	callback(200,data.headers);
	
}



posts.queryPost = (result)=>{

	resultObject.push(result);

}



posts.post = (data,callback)=>{ 
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

posts.get = (data,callback)=>{
	
	// let post = typeof(data.queryStringObject.post) == 'string' && data.queryStringObject.post.trim().length > 0 ? data.queryStringObject.post.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;
	let post = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;

	let queryObject = data.queryStringObject;
	
	if( 
		token && 
		uuidHeader  
		){

		let headerChecker = "SELECT * FROM tokens WHERE uuid='" + uuidHeader + "'";
		
		con.query(headerChecker,(err,results)=>{
			// console.log(results);
			if(!err && 
				results && 
				results[0].token.length > 0){


				let postQuery = "SELECT posts.*, COUNT(comments.uuid) as comments, COUNT(reactions.uuid) as reactions, COUNT(shares.uuid) as shares, COUNT(views.uuid) as views, JSON_OBJECT('email',users.email,'phone',users.phone,'dob',users.dob) as user_details FROM posts LEFT JOIN users ON users.uuid=posts.user LEFT JOIN views ON views.post=posts.uuid LEFT JOIN shares ON shares.post=posts.uuid LEFT JOIN reactions ON reactions.post=posts.uuid LEFT JOIN comments ON comments.ref=posts.uuid GROUP BY posts.id,comments.ref,reactions.post, shares.post,users.id ";

			if(queryObject && queryObject.user){

					postQuery = "SELECT posts.*, COUNT(comments.uuid) as comments, COUNT(reactions.uuid) as reactions, COUNT(shares.uuid) as shares, COUNT(views.uuid) as views, JSON_OBJECT('email',users.email,'phone',users.phone,'dob',users.dob) as user_details FROM posts LEFT JOIN users ON users.uuid=posts.user LEFT JOIN views ON views.post=posts.uuid LEFT JOIN shares ON shares.post=posts.uuid LEFT JOIN reactions ON reactions.post=posts.uuid LEFT JOIN comments ON comments.ref=posts.uuid WHERE posts.user='"+queryObject.user+"' GROUP BY posts.id,comments.ref,reactions.post, shares.post,users.id";

			
				}

				if(post){
					
					postQuery =  "SELECT * FROM posts WHERE uuid='" +post+"'; SELECT count(*) as reactions FROM reactions WHERE post='"+post+"'; SELECT count(*) as comments FROM comments WHERE ref='"+post+"'; SELECT count(*) as shares FROM shares WHERE post='" +post+ "';SELECT count(*) as views FROM views WHERE post='" +post+ "'";

				}
			 
				con.query(postQuery,(err,results,fields)=>{
					
					if(!err && results){

						 let compressedResult = [];

						
						compressedResult = [].concat.apply([], results);
						callback(200,{'posts':[].concat.apply([], results)});
						

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

		let errorObject = [];

		if(!token){
			errorObject.push('Token you supplied is not valid or expired');
		}
		if(!uuidHeader){
			errorObject.push('uuid in the header not found');
		}

		callback(400,{'Error':errorObject});
	}
}

 getWord = (post, callback) => {
    con.query("SELECT count(*) as reactions FROM reactions WHERE post='"+post+"'; SELECT count(*) as comments FROM comments WHERE ref='"+post+"'; SELECT count(*) as shares FROM shares WHERE post='" +post+ "'", (err, rows)=> {
        
        if(err) return callback(err);
        console.log('error => ');
        console.log(err);
        console.log('rows => ');
        console.log(rows);
        callback(null, rows);

    });
};

posts.put = (data,callback)=>{

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
						if(
							!err && 
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

posts.delete = (data,callback)=>{
	//get a user profile
	let post = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;
	// console.log('uuidQuery',data.queryStringObject.uuid);

	if( 
		token && 
		uuidHeader &&
		post 
		){

		let headerChecker = "SELECT * FROM tokens WHERE uuid='" + uuidHeader + "'";
		
		con.query(headerChecker,(err,results)=>{
			// console.log(results[0].token);
			if(!err && 
				results && 
				results[0].token.length > 0 &&
				results[0].token == token

				){

				let postQuery = "SELECT * FROM posts WHERE uuid='" + post + "'";
			
				con.query(postQuery, (err,result)=>{

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

		let errorObject = [];

		if(!token){
			errorObject.push('Token you supplied is not valid or expired');
		}
		if(!uuidHeader){
			errorObject.push('uuid in the header not found');
		}
		if(!post){
			errorObject.push('Post uuid not valid');
		}

		callback(400,{'Error':errorObject});
	}
}


module.exports = posts;
