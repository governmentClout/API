
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');
const tokens = require('./../lib/tokenization');
const async = require('async');


const con = mysql.createPool({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name,
  multipleStatements: true

});


friends = {};

friends.options = (data,callback)=>{

	callback(200,data.headers);
	
}

friends.get = (data,callback)=>{
	//get all friends list
	//get all blocked
	//get all pending
	//get all ignored

	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid; 
	let user = typeof(uuidHeader) == 'string' && uuidHeader.trim().length > 0 ? uuidHeader.trim() : false;
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;
	let param = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let queryObject = Object.keys(data.queryStringObject).length > 0 && typeof(data.queryStringObject) == 'object' ? data.queryStringObject : false;
	
	//if uuidHeader === queryObject.user, then the person can perform every activity, otherwise, uuidHeader can only see friend list of the queryObject.user
	//friends status: 0 - pending, 1 - ignored, 2 - accepted 3 - blocked.

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
					if(	param && 
						param != uuidHeader &&
						param != 'pending' &&
						param != 'blocked' &&
						param != 'ignored'
						){
						console.log('stage 1');
						//get all friends from another user
					let finalresult = [];

						async.waterfall([
						    function(callback) {

						    	let sqlGetFriends = "SELECT * FROM friends WHERE user='"+user+"' AND status=2";

						    	con.query(sqlGetFriends,(err,result)=>{
						    			
						    			if(!err && result.length > 0){
						    				callback(null,result);
						    			}else{
						    				callback(null,[]);
						    			}
										

									});
						    	
						    
						    },
						    function(arg, callback) {
						    	
						    	if(arg.length > 0){

						    		let result = [];
							    	var pending = arg.length;

							    	for(let i=0; i<arg.length; i++) {
							    		// console.log(arg[i].uuid);
							    	  con.query("SELECT * FROM profiles WHERE uuid='"+arg[i].user+"'; SELECT * FROM users WHERE uuid='"+arg[i].user+"'",(err, result)=>{
							    	 		
							    	 		
								            finalresult.splice(i,0,result);
								            

								            if( 0 === --pending ) {

								               	callback(null,finalresult);

								            }

								        });
							    	}

						    	}else{
						    		callback(null, []);
						    	}
						    	

						        
						    }
						], function (err, result) {
							
							callback(200,{'friends':result});

						});

				}
				


				if(!param){
					//get all my friends

					let finalresult = [];

						async.waterfall([
						    function(callback) {

						    	let sqlGetFriends = "SELECT * FROM friends WHERE user='"+user+"' AND status='2'";

						    	con.query(sqlGetFriends,(err,result)=>{
						    				
						    			if(!err && result.length > 0){
						    				callback(null,result);
						    			}else{
						    				callback(null,[]);
						    			}
										

									});
						    	
						    
						    },
						    function(arg, callback) {
						    	
						    	if(arg.length > 0){

						    		let result = [];
							    	var pending = arg.length;
							    	console.log(arg);
							    	for(let i=0; i<arg.length; i++) {
							    		
							    	  con.query("SELECT * FROM profiles WHERE uuid='"+arg[i].user+"'; SELECT * FROM users WHERE uuid='"+arg[i].user+"'",(err, result)=>{
							    	 		
							    	 		console.log(i);
								            finalresult.splice(i,0,{'user':result[1],'profile':result[0]});
								            
								            if( 0 === --pending ) {

								               	callback(null,finalresult);

								            }

								        });
							    	}

						    	}else{
						    		callback(null, []);
						    	}
						    	

						        
						    }
						], function (err, result) {
							
							callback(200,{'friends':result});

						});


					}

					if(param && param == 'ignored'){
					//get all ignored
					let finalresult = [];

						async.waterfall([

						    function(callback) {

						    	let sqlGetFriends = "SELECT * FROM friends WHERE user='"+user+"' AND status=1";

						    	con.query(sql,(err,result)=>{
						    			
						    			if(!err && result.length > 0){
						    				callback(null,result);
						    			}else{
						    				callback(null,[]);
						    			}
										

									});
						    	
						    
						    },
						    function(arg, callback) {
						    	
						    	if(arg.length > 0){

						    		let result = [];
							    	var pending = arg.length;

							    	for(let i=0; i<arg.length; i++) {
							    		// console.log(arg[i].uuid);
							    	  con.query("SELECT * FROM profiles WHERE uuid='"+arg[i].user+"'; SELECT * FROM users WHERE uuid='"+arg[i].user+"'",(err, result)=>{
							    	 		
							    	 		
								            finalresult.splice(i,0,result);
								            

								            if( 0 === --pending ) {

								               	callback(null,finalresult);

								            }

								        });
							    	}

						    	}else{
						    		callback(null, []);
						    	}
						    	

						        
						    }
						], function (err, result) {
							
							callback(200,{'ignored':result});

						});

					}

					if(param && param == 'blocked'){
					//get all blocked
					let finalresult = [];

						async.waterfall([
							
						    function(callback) {

						    	let sqlGetFriends = "SELECT * FROM friends WHERE user='"+user+"' AND status=3";

						    	con.query(sql,(err,result)=>{
						    			
						    			if(!err && result.length > 0){
						    				callback(null,result);
						    			}else{
						    				callback(null,[]);
						    			}
										

									});
						    	
						    
						    },
						    function(arg, callback) {
						    	
						    	if(arg.length > 0){

						    		let result = [];
							    	var pending = arg.length;

							    	for(let i=0; i<arg.length; i++) {
							    		// console.log(arg[i].uuid);
							    	  con.query("SELECT * FROM profiles WHERE uuid='"+arg[i].user+"'; SELECT * FROM users WHERE uuid='"+arg[i].user+"'",(err, result)=>{
							    	 		
							    	 		
								            finalresult.splice(i,0,result);
								            

								            if( 0 === --pending ) {

								               	callback(null,finalresult);

								            }

								        });
							    	}

						    	}else{
						    		callback(null, []);
						    	}
						    	

						        
						    }
						], function (err, result) {
							
							callback(200,{'blocked':result});

						});

					}

					if(param && param == 'pending'){
					//get all blocked
					console.log('pending');
					let finalresult = [];

						async.waterfall([
						    function(callback) {

						    	let sqlGetFriends = "SELECT * FROM friends WHERE user='"+user+"' AND status='0'";

						    	con.query(sqlGetFriends,(err,result)=>{
						    			
						    			if(!err && result.length > 0){
						    			

						    				callback(null,result);

						    			}else{
						    				callback(null,[]);
						    			}
										

									});
						    },
						    function(arg, callback) {
						    			
						    	if(arg.length > 0){
						    			

						    		let result = [];
							    	var pending = arg.length;

							    	for(let i=0; i<arg.length; i++) {
							    		
							    	  con.query("SELECT * FROM profiles WHERE uuid='"+arg[i].user+"'; SELECT * FROM users WHERE uuid='"+arg[i].user+"'",(err, result)=>{
							    	 		
								            finalresult.splice(i,0,{'user':result[0],'profile':result[1]});
								            
								            if( 0 === --pending ) {

								               	callback(null,finalresult);

								            }
				
								        });
							    	}

						    	}else{
						    		callback(null, []);
						    	}
						    	

						        
						    }
						], 
						function (err, result) {
							
							callback(200,{'friends':result});

						});
						
					}

						
				}
				else{

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

friends.post = (data,callback)=>{
	//send friend request
	//accept friend request
	//block friend
	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid; 
	let user = typeof(uuidHeader) == 'string' && uuidHeader.trim().length > 0 ? uuidHeader.trim() : false;
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;
	//request is being sent to:
	let friend = typeof(data.payload.friend) == 'string' && data.payload.friend.trim().length > 0 ? data.payload.friend.trim() : false;
	let queryObject = Object.keys(data.queryStringObject).length > 0 && typeof(data.queryStringObject) == 'object' ? data.queryStringObject : false;
	let param = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let uuid = uuidV1();
	//friends/request
	//friends/accept
	//friends/block
	//if request: user is the requester, friend is the requestee
	//if accept: user is the accepter, friend is the accepted
	//if ignore: user is the ignorer, friend is the ignored
	//if block: user is the blocker, friend is the blocked.

	//friends status: 0 - pending, 1 - ignored, 2 - accepted 3 - blocked.

	if( 
		token && 
		uuidHeader 

		){
		

		let headerChecker = "SELECT * FROM tokens WHERE uuid='" + uuidHeader + "'";
		
		
		con.query(headerChecker,(err,results)=>{
			
			if(!err && 
				results && 
				results[0].token.length > 0){

					if(param && param == 'request'){
						//check if request does not already exist
						//check if they are not already friends
						//send friend request

						let checkRequest = "SELECT * FROM friends WHERE (user='"+user+"' OR friend='"+friend+"' OR user='"+friend+"' OR friend='"+user+"')";

						con.query(checkRequest,(err,result)=>{

							if(!err && result.length < 1){
								//proceed
								
								let sqlRequest = "INSERT INTO friends (uuid,friend,user) VALUES('"+uuid+"','"+friend+"','"+user+"')";

								con.query(sqlRequest,(err,result)=>{
									if(!err && result){

										mailer.sendByUUID({
						   					'uuid':user,
						   					'subject':'Notification: Friend Request',
						   					'message':'You have a new friend request'
						   					});

										callback(200,{'Success':'Request Sent'});

									}else{
										console.log(err);
										callback(500,{'Error':err});
									}
								});

							}else{

								let errorObject = [];

								if(err){
									errorObject.push(err);
								}

								if(result.length > 0){
									errorObject.push('request already exist');
								}

								callback(400,{'Error':errorObject});
							}

						});



					}

					if(param && param == 'accept'){
						//accept friend request
						//check if request has not already been accepted

						let checkRequest = "SELECT * FROM friends WHERE (user='"+user+"' OR friend='"+friend+"' OR user='"+friend+"' OR friend='"+user+"')";

						con.query(checkRequest,(err,result)=>{
							// console.log(result[0].uuid);
							if(!err && result.length > 0 && result.status != 2){

								let sqlAccept = "UPDATE friends SET status='2' WHERE uuid='"+result[0].uuid+"'";

								con.query(sqlAccept,(err,result)=>{

									if(!err && result){
										mailer.sendByUUID({
						   					'uuid':user,
						   					'subject':'Notification: Friend Request',
						   					'message':'Your friend request has been accepted'
						   					});
										callback(200,{'Success':'Request Accepted'});

									}else{
										console.log(err);
										callback(500,{'Error':err});
									}

								});

							}else{

								let errorObject = [];

								if(result.status == 2){
									errorObject.push('Friend request already accepted');
								}

								if(err){
									errorObject.push(err);
								}

								if(request.length < 1){
									errorObject.push('Request Not found');
								}

								callback(400,{'Error':errorObject});
							}
						});
					}

					if(param && param == 'ignore'){
						//accept friend request
						//check if request has not already been accepted

						let checkRequest = "SELECT count(*) FROM friends WHERE (user='"+user+"' AND friend='"+friend+"') OR  (friend='"+user+"' AND user='"+friend+"')";

						con.query(checkRequest,(err,result)=>{

							if(!err && request.length > 0 && result.status != 1){

								let sqlAccept = "UPDATE friends SET status='1' WHERE uuid='"+result[0].uuid+"')";

								con.query(sqlAccept,(err,result)=>{

									if(!err && result){

										callback(200,{'Success':'Request Ignored'});

									}else{
										console.log(err);
										callback(500,{'Error':err});
									}

								});

							}else{

								let errorObject = [];

								if(result.status == 1){
									errorObject.push('Friend request already ignored');
								}

								if(err){
									errorObject.push(err);
								}

								if(request.length < 1){
									errorObject.push('Request Not found');
								}

								callback(400,{'Error':errorObject});
							}
						});
					}

					if(param && param == 'block'){
						
						let checkRequest = "SELECT count(*) FROM friends WHERE (user='"+user+"' AND friend='"+friend+"') OR  (friend='"+user+"' AND user='"+friend+"')";

						con.query(checkRequest,(err,result)=>{

							if(!err && request.length > 0 && resquest.status != 3){

								let sqlAccept = "UPDATE friends SET status='3' WHERE uuid='"+result[0].uuid+"')";

								con.query(sqlAccept,(err,result)=>{

									if(!err && result){

										callback(200,{'Success':'Request Accepted'});

									}else{
										console.log(err);
										callback(500,{'Error':err});
									}

								});

							}else{

								let errorObject = [];

								if(result.status == 3){
									errorObject.push('friend already blocked');
								}

								if(err){
									errorObject.push(err);
								}

								if(request.length < 1){
									errorObject.push('Request Not found');
								}

								callback(400,{'Error':errorObject});
							}
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
			errorObject.push('Token you supplied is not valid or has expired');
		}
		if(!uuidHeader){
			errorObject.push('uuid in the header not found');
		}

		callback(400,{'Error':errorObject});
	}

}

friends.delete = (data,callback)=>{
	//delete friend
	//

	callback(200,{'success':'you have hit friends delete endpoint'})

}






module.exports = friends;
