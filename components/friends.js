
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


friends = {};

friends.options = (data,callback)=>{

	callback(200,data.headers);
	
}

friends.get = (data,callback)=>{
	//get all friends list
	//get all friend requests

	

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

	let param = typeof(data.payload.param) == 'string' && data.payload.param.trim().length > 0 ? data.payload.param.trim() : false;
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

						let checkRequest = "SELECT count(*) FROM friends WHERE (user='"+user+"' AND friend='"+friend+"') OR  (friend='"+user+"' AND user='"+friend+"')";

						con.query(checkRequest,(err,result)=>{

							if(!err && request.length < 1){
								//proceed
								
								let sqlRequest = "INSERT INTO friends (uuid,friend,user) VALUES('"+uuid+"','"+friend+"','"+user+"')";

								con.query(sqlRequest,(err,result)=>{
									if(!err && result){

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

								if(request.length > 0){
									errorObject.push('Connection between users already exist');
								}

								callback(400,{'Error':errorObject});
							}

						});



					}

					if(param && param == 'accept'){
						//accept friend request
						//check if request has not already been accepted

						let checkRequest = "SELECT count(*) FROM friends WHERE (user='"+user+"' AND friend='"+friend+"') OR  (friend='"+user+"' AND user='"+friend+"')";

						con.query(checkRequest,(err,result)=>{

							if(!err && request.length > 0 && result.status != 2){

								let sqlAccept = "UPDATE friends SET status=2 WHERE uuid='"+result.uuid+"')";

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

								let sqlAccept = "UPDATE friends SET status=1 WHERE uuid='"+result.uuid+"')";

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

								let sqlAccept = "UPDATE friends SET status=3 WHERE uuid='"+result.uuid+"')";

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






module.exports = shares;
