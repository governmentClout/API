
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');
const tokens = require('./../lib/tokenization');
const mailer = require('./mailer');


const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name

});

let comments = {};

comments.options = (data,callback)=>{

	callback(200,data.headers);
	
}

comments.post = (data,callback)=>{
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

						let sql = "INSERT INTO comments (uuid,user,comment,ref) VALUES('"+uuid+"','"+user+"','" + comment+"','"+ref+"')";

						con.query(sql,(err,result)=>{

							if(!err && result){
								mailer.sendByUUID({
						   					'uuid':user,
						   					'subject':'Notification: Comment',
						   					'message':'You have a new comment on your post'
						   					});
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

comments.get = (data,callback)=>{
	
	let ref = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;
	
	if(data && 
		token && 
		uuidHeader &&
		ref 
		){

		let headerChecker = "SELECT * FROM tokens WHERE uuid='" + uuidHeader + "'";
		
		con.query(headerChecker,(err,results)=>{
			// console.log(results[0].token);
			if(!err && 
				results && 
				results[0].token.length > 0 &&
				results[0].token == token
				){

				let commentQuery = "SELECT comment,user,uuid,created_at,updated_at FROM comments WHERE ref='" + ref + "'";
			// console.log('uuid ' + uuidHeader);
				con.query(commentQuery,(err,result)=>{
					
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

comments.put = (data,callback)=>{
	callback(200,{'Success':'You have hit the comment put endpoint'});
}

comments.delete = (data,callback)=>{
	
	//get a user profile
	let comment = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;
	// console.log('uuidQuery',data.queryStringObject.uuid);

	if(data && 
		token && 
		uuidHeader &&
		comment 
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


module.exports = comments;
