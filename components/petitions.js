const _db = require('./../lib/migrations');
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

let petitions = {};

petitions.options = (data,callback)=>{

	callback(200,data.headers);
	
}
/**
 * @api {post} /petitions Create Petition 
 * @apiName createPetition
 * @apiGroup Petitions
 * @apiDescription The endpoint creates a new petition
 * @apiParam {String} targeted_office Office the petition is targetted at.
 * @apiParam {String} petition_class Class of this petition
 * @apiParam {String} petition_title Title of this petition
 * @apiParam {String} status Published 1, don't publish 0.
 * @apiParam {String} petition Content of the petition
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *{
 *   "Success": "Petition Created"
 *}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 400 Bad Request
 * {
 *   "Error": [
 *       "Petition content is required"
 *   ]
 * }
 *@apiErrorExample Error-Response:
 *HTTP/1.1 400 Bad Request
 * {
 *   "Error": [
 *       "Petition Title is required"
 *   ]
 *}
 */

petitions.post = (data,callback)=>{
	//create polls
	//respond to polls
	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid; 
	let user = typeof(uuidHeader) == 'string' && uuidHeader.trim().length > 0 ? uuidHeader.trim() : false;
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;
	let targeted_office = typeof(data.payload.targeted_office) == 'string' && data.payload.targeted_office.trim().length > 0 ? data.payload.targeted_office.trim() : false;
	let petition_class = typeof(data.payload.petition_class) == 'string' && data.payload.petition_class.trim().length > 0 ? data.payload.petition_class.trim() : false;
	let petition_title = typeof(data.payload.petition_title) == 'string' && data.payload.petition_title.trim().length > 0 ? data.payload.petition_title.trim() : false;
	let status = typeof(data.payload.status) == 'string' && data.payload.status.trim().length > 0 ? data.payload.status.trim() : '1';
	let petition = typeof(data.payload.petition) == 'string' && data.payload.petition.trim().length > 0 ? data.payload.petition.trim() : false;
	let attachment = typeof(data.payload.attachment) == 'object' && data.payload.attachment.length > 0  ? data.payload.attachment : null;
//@TODO: Change petition attachment to comma separated strings
	let uuid = uuidV1();


	if( 
		token && 
		uuidHeader 

		){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

		con.query(verifyToken, (err,result)=>{
				
			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){

				if( targeted_office && 
					petition_class &&
					petition &&
					petition_title
					){

					if(attachment){
							attachment = JSON.stringify(attachment);
						}

					let sqlCreatePetition = "INSERT INTO petitions (uuid,user,targeted_office,petition_class,petition_title,attachment,status) VALUES ('"+uuid+"','"+user+"','"+targeted_office+"','"+petition_class+"','"+petition_title+"','" + attachment + "','0')";

					con.query(sqlCreatePetition,(err,result)=>{

						if(!err && result){

							callback(200,{'Success':'Petition Created'});

						}else{
							console.log(err);
							callback(500,{'Error':err});
						}

					});

				}else{

					let errorObject = [];

					if(!targeted_office){
						errorObject.push('Targeted Office is a required field');
					}
					if(!petition_class){
						errorObject.push('Petition Class is required');
					}
					if(!petition){
						errorObject.push('Petition content is required');
					}
					if(!petition_title){
						errorObject.push('Petition Title is required');
					}


					console.log(errorObject);
					callback(400,{'Error':errorObject});

				}

				
			}else{
				console.log(err);
				callback(400,{'Error':'Token Mismatch or expired'});
			
			}
		});

	}else{

		let errorObject = [];

		if(!token){
			errorObject.push('Token you supplied is not valid or has expired');
		}
		if(!uuidHeader){
			errorObject.push('uuid in the header not found');
		}

		callback(400,{'Error':errorObject});

	}
	
}

petitions.get = (data,callback)=>{
	
	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid; 
	let user = typeof(uuidHeader) == 'string' && uuidHeader.trim().length > 0 ? uuidHeader.trim() : false;
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;
	let param = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let userPetition = typeof(data.queryStringObject.user) == 'string' && data.queryStringObject.user.trim().length > 0 ? data.queryStringObject.user.trim() : false; //should be ?user={uuid}


	let page = typeof(data.queryStringObject.page) == 'string'  ? data.queryStringObject.page : '1'; 
	let limit = typeof(data.queryStringObject.limit) == 'string' ? data.queryStringObject.limit : '10';
	let sort = typeof(data.queryStringObject.sort) == 'string' && data.queryStringObject.sort.trim().length > 0 && (data.queryStringObject.sort.trim() == 'ASC' || 'DESC') ? data.queryStringObject.sort.trim() : 'DESC';


	if( 
		token && 
		uuidHeader 

		){


			let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

			con.query(verifyToken, (err,result)=>{
				
				if(
					!err && 
					result[0] && 
					result[0].token == token 

					){

					//get all petitions
					//get single users petitions
					//get all petitions response
					if(userPetition){
						
						//then get polls belonging to a single user
						
						let finalresult = [];
						//just get everything and give it to them
						async.waterfall([
					    function(callback) {
					    	let sql = "SELECT * FROM petitions WHERE user='"+user+"'";

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
					    		console.log(result);
									callback(null,result);

								});
					    	
					    
					    },
					    function(arg, callback) {
					    	
					    	let result = [];
					    	var pending = arg.length;

					    	for(let i=0; i<arg.length; i++) {
					    		
					    	 con.query("SELECT * FROM polls_response WHERE poll='"+arg[i].uuid+"'; SELECT firstName,lastName,photo from profiles where uuid='"+arg[i].created_by+"'",(err, compile)=>{
					    	 		console.log(compile);
					    	 		let polls = arg[i];
					    	 		
						            finalresult.splice(i,0,{'polls':arg[i],'responses':compile[0], 'user':compile[1]});
						            

						            if( 0 === --pending ) {

						               	callback(null, finalresult);

						            }

						        });
					    	}

					        
					    }
					], function (err, result) {
						console.log(result);
						callback(200,result);
					});
				}

					

					if(param){
						
						//get single poll and all respoonse with profile of the responders

						let finalresult = [];
						//just get everything and give it to them
						async.waterfall([
					    function(callback) {
					    	let sql = "SELECT * FROM petitions WHERE uuid='"+param+"'";

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
									console.log('point 1');
									callback(null,result);

								});
					    	
					    
					    },
					    function(arg, callback) {
					    	
					    	let result = [];
					    	var pending = arg.length;
					    
					    		
					    	 con.query("SELECT * FROM petitions_response WHERE poll='"+arg[0].uuid+"'; SELECT firstName,lastName,photo from profiles where uuid='"+arg[i].created_by+"'",(err, compile)=>{
					    	 		
						               	callback(null, {'poll':arg,'responses':compile[0], 'user':compile[1]});

						        });
					    

					        
					    },
					     function(arg, callback) {

					     	
					    	let result = [];
					    	var pending = arg.response.length;
					    	let poll = arg.poll;
					    	let responses = arg.response;
					  
					    	if(responses.length > 0){

					    		for(let i=0; i<pending; i++) {
					    		
						    	 con.query("SELECT * FROM profiles WHERE uuid='"+responses[i].user+"'",(err, users)=>{
						    	 	
							            finalresult.splice(i,0,users);
							            
							            if( 0 === --pending ) {
							            	
							               	callback(null, {'poll':poll,'responses':finalresult});

							            }

							        });
						    	}

					    	}else{
					    		callback(null, {'petition':poll,'responses':[]});
					    	}
					    	

					        
					    }
					], function (err, result) {
						
						callback(200,{'poll':result.poll,'responses':result.responses});
					});
					

					}

					if(!param && !userPoll){
						console.log('here');
						let finalresult = [];
						//just get everything and give it to them
						async.waterfall([
					    function(callback) {
					    	let sql = "SELECT * FROM polls";

					    	con.query(sql,(err,result)=>{

									callback(null,result);

								});
					    	
					    
					    },
					    function(arg, callback) {
					    	
					    	let result = [];
					    	var pending = arg.length;

					    	for(let i=0; i<arg.length; i++) {
					    		
					    	 con.query("SELECT * FROM polls_response WHERE poll='"+arg[i].uuid+"'; SELECT firstName,lastName, photo from profiles where uuid='"+arg[i].created_by+"'",(err, compile)=>{
					    	 		// console.log(compile);
					    	 		let polls = arg[i];
					    	 		
						            finalresult.splice(i,0,{'polls':arg[i],'responses':compile[0], 'user':compile[1]});
						            

						            if( 0 === --pending ) {

						               	callback(null, finalresult);

						            }

						        });
					    	}

					        
					    }
					], function (err, result) {
						console.log(result);
						callback(200,result);
					});
					}



				}else{
					console.log(err);
					callback(400,{'Error':'Token Mismatch or expired'});
				}
			});

	}else{

		let errorObject = [];

		if(!token){
			errorObject.push('Token you supplied is not valid or has expired');
		}
		if(!uuidHeader){
			errorObject.push('uuid in the header not found');
		}

		callback(400,{'Error':errorObject});

	}

}




petitions.put = (data,callback)=>{
	//to sign petition
	callback(200,{'Success':'You have hit the petition get endpoint'});
}

petitions.delete = (data,callback)=>{

	let petition = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;

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

				let postQuery = "SELECT * FROM petitions WHERE uuid='" + petition + "'";
			
				con.query(postQuery, (err,result)=>{

					if(!err && result[0]){

						let deletePost = "DELETE FROM petitions WHERE uuid='"+petition+"'";

						con.query(deletePost,(err,result)=>{

							
							callback(200,{'Success':'Petition deleted'});
								
							
						});

					}else{
						console.log(err);
						callback(404,{'Error':'Petition not found'});
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
			errorObject.push('Petition uuid not valid');
		}

		callback(400,{'Error':errorObject});
	}

}




module.exports = petitions;

