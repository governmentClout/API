

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


reactions = {};

reactions.options = (data,callback)=>{

	callback(200,data.headers);
	
}

reactions.get = (data,callback)=>{

	let token = data.headers.token;
	let user = data.headers.uuid;
	let post = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
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

reactions.delete = (data,callback)=>{
	//get a user profile
	let reaction = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;
	// console.log('uuidQuery',data.queryStringObject.uuid);

	if(
		data && 
		token && 
		uuidHeader &&
		reaction 

		){

		let headerChecker = "SELECT * FROM tokens WHERE uuid='" + uuidHeader + "'";
		
		con.query(headerChecker, (err,results)=>{
			console.log('token ' + results[0].token);
			if(
				!err && 
				results && 
				results[0].token.length > 0 &&
				results[0].token == token 

				){

				let reactionQuery = "SELECT count(*) FROM reactions WHERE uuid='" + reaction + "'";
			
				con.query(reactionQuery, (err,result)=>{

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


module.exports = reactions;
