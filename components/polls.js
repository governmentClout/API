const _db = require('./../lib/migrations');
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');
const async = require('async');
const con = require('../lib/db');

let polls = {};


polls.options = (data,callback)=>{

	callback(200,data.headers);
	
}

polls.post = (data,callback)=>{

	//create polls
	//respond to polls
	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid; 
	let user = typeof(uuidHeader) == 'string' && uuidHeader.trim().length > 0 ? uuidHeader.trim() : false;
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;

	let param = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let sector = typeof(data.payload.sector) == 'string' && data.payload.sector.trim().length > 0 ? data.payload.sector.trim() : false;
	let opinion = typeof(data.payload.opinion) == 'string' && data.payload.opinion.trim().length > 0 ? data.payload.opinion.trim() : false;
	let expire_at = typeof(data.payload.expire_at) == 'string' && data.payload.expire_at.trim().length > 0 ? data.payload.expire_at.trim() : '2054-01-01 00:00:00';
	let response_limit = typeof(data.payload.response_limit) == 'string' && data.payload.response_limit.trim().length > 0 ? data.payload.response_limit.trim() : '1000';
	let status = typeof(data.payload.status) == 'string' && data.payload.status.trim().length > 0 ? data.payload.status.trim() : '1';

	let queryObject = Object.keys(data.queryStringObject).length > 0 && typeof(data.queryStringObject) == 'object' ? data.queryStringObject : false;

	let poll = typeof(data.payload.poll) == 'string' && data.payload.poll.trim().length > 0 ? data.payload.poll.trim() : false;

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

				if( !param && opinion && sector ){

					//create new poll
					//user is the uuid of the creator
				
					let sqlCreatePoll = "INSERT INTO polls (uuid,sector,opinion,expire_at,response_limit,created_by) VALUES ('"+uuid+"','"+sector+"','"+opinion+"','"+expire_at+"','"+response_limit+"','" + user + "')";

					con.query(sqlCreatePoll,(err,result)=>{

						if(!err && result){

							callback(200,{'Success':'Poll Created'});

						}else{
							console.log(err);
							callback(500,{'Error':err});
						}

					});

				}

				if(!param && (!opinion || !sector)){

					let errorObject = [];
					if(!param){
						errorObject.push('No Parameter set');
					}
					if(!opinion){
						errorObject.push('Opinion required');
					}
					if(!sector){
						errorObject.push('sector is required');
					}
					console.log(errorObject);
					callback(400,{'Error':errorObject});

				}

				if(param && param == 'response'){
					// respond to a poll
					//user is the uuid of the responder, poll is the poll
					//check that user has not already responded
					//response status: 1 - true/agree/yes 2 - no/disagree/false 3 - undecided

					let checkResponse = "SELECT count(*) as count FROM polls_response WHERE user='"+user+"' and poll='" +poll+ "'";

					con.query(checkResponse,(err,result)=>{
						// console.log(result[0].count);
						if(!err && result[0].count == 0){

							
							let sqlResponse = "INSERT polls_response (user,poll,status) VALUES ('"+user+"','"+poll+"','" +status+ "')";

							con.query(sqlResponse,(err,result)=>{

								if(!err && result){

									callback(200,{'Success':'response submitted'});

								}else{
									callback(500,{'Error':err});
								}
 
							});



						}else{
							callback(400,{'Error':'User already responded to poll'});
						}

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

polls.get = (data,callback)=>{
	
	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid; 
	let user = typeof(uuidHeader) == 'string' && uuidHeader.trim().length > 0 ? uuidHeader.trim() : false;
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;
	let param = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let userPoll = typeof(data.queryStringObject.user) == 'string' && data.queryStringObject.user.trim().length > 0 ? data.queryStringObject.user.trim() : false; //should be ?user={uuid}

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

					//get all polls
					//get single users polls
					//get all polls response
					if(userPoll){
						
						//then get polls belonging to a single user
						
						let finalresult = [];
						//just get everything and give it to them
						async.waterfall([
					    function(callback) {
					    	let sql = "SELECT * FROM polls WHERE created_by='"+userPoll+"'";

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
					    	let sql = "SELECT * FROM polls WHERE uuid='"+param+"'";

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
					    
					    		
					    	 con.query("SELECT * FROM polls_response WHERE poll='"+arg[0].uuid+"'; SELECT firstName,lastName,photo from profiles where uuid='"+arg[i].created_by+"'",(err, compile)=>{
					    	 		
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
					    		callback(null, {'poll':poll,'responses':[]});
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

polls.delete = (data,callback)=>{
	
	let poll = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
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

				let pollQuery = "SELECT * FROM polls WHERE uuid='" + poll + "'";
			
				con.query(pollQuery, (err,result)=>{

					if(!err && result[0]){

						let deletePoll = "DELETE FROM polls WHERE uuid='"+poll+"'";

						con.query(deletePoll,(err,result)=>{

							
							callback(200,{'Success':'Poll deleted'});
								
							
						});

					}else{
						console.log(err);
						callback(404,{'Error':'Poll not found'});
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
		if(!poll){
			errorObject.push('Poll uuid not valid');
		}

		callback(400,{'Error':errorObject});
	}

}

module.exports = polls;
