
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const async = require('async');


let posts = {};
let resultObject = [];

posts.options = (data,callback)=>{

	callback(200,data.headers);
	
}

posts.post = (data,callback)=>{ 
	//create a new post

	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid;

	let post = typeof(data.payload.post) == 'string' && data.payload.post.trim().length > 0 ? data.payload.post.trim() : false;
	let location = typeof(data.payload.location) == 'string' && data.payload.location.trim().length > 0 ? data.payload.location.trim() : 'unspecified';
	let attachment = typeof(data.payload.attachment) == 'string' && data.payload.attachment.trim().length > 0  ? data.payload.attachment : null;
	let post_type = typeof(data.payload.post_type) == 'string' && data.payload.post_type.trim().length > 0  ? data.payload.post_type : 'post';
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
	
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;
	let post = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;

	let queryObject = Object.keys(data.queryStringObject).length > 0 && typeof(data.queryStringObject) == 'object' ? data.queryStringObject : false;


	let page = typeof(data.queryStringObject.page) == 'string'  ? data.queryStringObject.page : '1'; 
	let limit = typeof(data.queryStringObject.limit) == 'string' ? data.queryStringObject.limit : '10';
	let sort = typeof(data.queryStringObject.sort) == 'string' && data.queryStringObject.sort.trim().length > 0 && (data.queryStringObject.sort.trim() == 'ASC' || 'DESC') ? data.queryStringObject.sort.trim() : 'DESC';
	let total_record = 0;

	if( 
		token && 
		uuidHeader 
		 
		){
		

		let headerChecker = "SELECT * FROM tokens WHERE uuid='" + uuidHeader + "'";
		
		
		con.query(headerChecker,(err,results)=>{
			
			if(!err && 
				results.length > 0 ){

				if( !post && !queryObject.user ){
					
					let finalresult = [];

					async.waterfall([
					    function(callback) {
					    	//check if limit is set
					    	//do all pagination calculation here
					    	let sql = "SELECT * FROM posts";

					    	if(sort){
					    		sql += " ORDER BY id " + sort;
 					    	}

					    	if(limit){
					    		sql += " LIMIT " + limit;
					    	}

					    	if(page){
					    		
					    		let skip = page == '1' ? 0 : page * limit;
					    		sql += " OFFSET " + skip;

					    	}
					    	
					    	con.query(sql,(err,result)=>{
					    			total_record = result.length;
					    			result.length > 0 ? callback(null,result) : callback(null,[]);
									
								});
					    	
					    
					    },
					    function(arg, callback) {
					    	
					    	let result = [];
					    	var pending = arg.length;

					    	if(arg.length === 0) return callback(null,[]);

					    	for(let i=0; i<arg.length; i++) {
					    		
					    	 con.query("SELECT profiles.lga,profiles.firstName,profiles.lastName,profiles.photo,profiles.nationality_residence,profiles.nationality_origin,profiles.state,users.email,users.phone,users.dob FROM profiles,users WHERE users.uuid ='"+arg[i].user+"' AND profiles.uuid='"+arg[i].user+"' LIMIT 1;SELECT * FROM comments WHERE ref='"+arg[i].uuid+"';SELECT * from reactions WHERE post='"+arg[i].uuid+"';SELECT * FROM shares WHERE post='"+arg[i].uuid+"';SELECT * FROM views WHERE post='"+arg[i].uuid+"'",(err, compile)=>{
					    	 		
					    	 		let post = arg[i];
					    	 		
						            finalresult.splice(i,0,{'post':post,'user':compile[0],'comments':compile[1],'reactions':compile[2],'shares':compile[3],'views':compile[4]});
						            

						            if( 0 === --pending ) {

						               	callback(null, finalresult);

						            }

						        });
					    	}

					        
					    }
					], function (err, result) {
						
						callback(200,{'posts':result,'total_record':total_record,'page':page,'per_page':limit,'sort':sort});
					});
				}

			if(queryObject && queryObject.user){
					
				let finalresult = [];

					async.waterfall([
					    function(callback) {
					    	let sql = "SELECT * FROM posts WHERE user='"+queryObject.user+"'";

					    	if(sort){
					    		sql += " ORDER BY id " + sort;
 					    	}

					    	if(limit){
					    		sql += " LIMIT " + limit;
					    	}

					    	if(page){

					    		let skip = page * limit;
					    		sql += " OFFSET " + skip;

					    	}
					    	con.query(sql,(err,result)=>{
					    			total_record = result.length;
									callback(null,result);
								});
					    	
					    
					    },
					    function(arg, callback) {
					    	
					    	let result = [];
					    	var pending = arg.length;

					    	for(let i=0; i<arg.length; i++) {
					    		
					    	 con.query("SELECT profiles.lga,profiles.firstName,profiles.lastName,profiles.photo,profiles.nationality_residence,profiles.nationality_origin,profiles.state,users.email,users.phone,users.dob FROM profiles,users WHERE users.uuid ='"+arg[i].user+"' AND profiles.uuid='"+arg[i].user+"' LIMIT 1;SELECT * FROM comments WHERE ref='"+arg[i].uuid+"';SELECT * from reactions WHERE post='"+arg[i].uuid+"';SELECT * FROM shares WHERE post='"+arg[i].uuid+"';SELECT * FROM views WHERE post='"+arg[i].uuid+"'",(err, compile)=>{
					    	 		
					    	 		let post = arg[i];
					    	 		
						            finalresult.splice(i,0,{'post':post,'user':compile[0],'comments':compile[1],'reactions':compile[2],'shares':compile[3],'views':compile[4]});
						            

						            if( 0 === --pending ) {

						               	callback(null, finalresult);

						            }

						        });
					    	}

					        
					    }
					], function (err, result) {
						
						callback(200,{'posts':result,'total_record':total_record,'page':page,'per_page':limit,'sort':sort});
					});

			
				}

			

				if(post){

					let finalresult = [];

					async.waterfall([
					    function(callback) {
					    	let sql = "SELECT * FROM posts WHERE uuid='"+post+"'";
					    	con.query(sql,(err,result)=>{
					    		total_record = result.length;
									callback(null,result);
								});
					    	
					    
					    },
					    function(arg, callback) {
					    	
					    	let result = [];
					    	var pending = arg.length;

					    	for(let i=0; i<arg.length; i++) {
					    	
					    	  con.query("SELECT profiles.lga,profiles.firstName,profiles.lastName,profiles.photo,profiles.nationality_residence,profiles.nationality_origin,profiles.state,users.email,users.phone,users.dob FROM profiles,users WHERE users.uuid ='"+arg[i].user+"' AND profiles.uuid='"+arg[i].user+"' LIMIT 1;SELECT * FROM comments WHERE ref='"+arg[i].uuid+"';SELECT * from reactions WHERE post='"+arg[i].uuid+"';SELECT * FROM shares WHERE post='"+arg[i].uuid+"';SELECT * FROM views WHERE post='"+arg[i].uuid+"'",(err, compile)=>{
					    	 		
					    	 		let post = arg[i];
					    	 		
						            finalresult.splice(i,0,{'post':post,'user':compile[0],'comments':compile[1],'reactions':compile[2],'shares':compile[3],'views':compile[4]});
						            

						            if( 0 === --pending ) {

						               	callback(null, finalresult);

						            }

						        });
					    	}

					        
					    }
					], function (err, result) {
						
						callback(200,{'posts':result,'total_record':total_record,'page':page,'per_page':limit,'sort':sort});
					});
				

				}
			 
				

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


posts.put = (data,callback)=>{

	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid;
	// let uuid = typeof(uuidHeader) == 'string' && uuidHeader.trim().length > 0 ? uuidHeader.trim() : false;
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;
	let postuuid = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;

	if(token && postuuid){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + uuidHeader + "'";

		con.query(verifyToken, (err,result)=>{

			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){
				
					let checkPost = "SELECT * FROM posts WHERE uuid='" + postuuid + "'";

					con.query(checkPost, (err,result)=>{
						
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
