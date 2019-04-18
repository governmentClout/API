const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const tokens = require('./../lib/tokenization');

const con = require('./../lib/db');

friendrequests = {};

friendrequests.options = (data,callback)=>{

	callback(200,data.headers);
	
}

/**
 * @api {post} /friendrequests Send New Friend Request 
 *
 * @apiName sendFriendRequest
 * @apiGroup FriendRequests
 * @apiHeader {String} uuid Authorization UUID .
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint send friend request
 * @apiParam {String} request_sender uuid of the user sending the friend request  
 * @apiParam {String} request_receiver uuid of the user to receive the friend request
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
{
    "Success": "Friend Request Sent"
}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 405 Bad Request
{
    "Error": "Request already exists, close that request first before sending another"
}

 */

friendrequests.post = (data,callback)=>{

    let uuid = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
    let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
    
    let request_sender = typeof(data.payload.request_sender) == 'string' && data.payload.request_sender.trim().length > 0 ? data.payload.request_sender.trim() : false;
    let request_receiver = typeof(data.payload.request_receiver) == 'string' && data.payload.request_receiver.trim().length > 0 ? data.payload.request_receiver.trim() : false;
    
    let uuid = uuidV1();

	if( 
		token && 
        uuid &&
        request_sender &&
        request_receiver
		){
            let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

            con.query(verifyToken, (err,result)=>{

                if(
                    !err && 
                    result[0] && 
                    result[0].token == token 
    
                    ){

                        let checkRequest = "SELECT * FROM friendrequests WHERE request_sender='"+request_sender+"' AND request_receiver='"+request_receiver+"'; SELECT * FROM friends WHERE request_sender='"+request_receiver+"' AND request_receiver='"+request_sender+"'";

						con.query(checkRequest,(err,result)=>{
							
							if(!err && result[0].length < 1 && result[1].length < 1){
																
								let sqlRequest = "INSERT INTO friendrequests (uuid,request_sender,request_receiver) VALUES('"+uuid+"','"+request_sender+"','"+request_receiver+"')";

								con.query(sqlRequest,(err,result)=>{

									if(!err && result){

										mailer.sendByUUID({
						   					'uuid':request_receiver,
						   					'subject':'Notification: Friend Request',
						   					'message':'You have a new friend request'
						   					});

										callback(200,{'Success':'Friend Request Sent'});

									}else{
                                        //@TODO: Change this error message to a more friendly error
                                        console.log(err);
                                        callback(500,{'Error':err});
                                        
									}
								});

							}else{

								let errorObject = [];

								if(err){
									errorObject.push(err);
								}

								if(result[0].length > 0 || result[1].length > 0){
									errorObject.push('Request already exists, close that request first before sending another');
								}

								callback(400,{'Error':errorObject});
							}

						});

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
                if(!uuid){
                    errorObject.push('UUID you supplied is invalid or expired');
                }
                if(!request_sender){
                    errorObject.push('Required Parameter request_sender is missing or invalid');
                }
                if(!request_receiver){
                    errorObject.push('Required Parameter request_receiver is missing or invalid');
                }
        
                callback(400,{'Error':errorObject});
        
            
        }
}

friendrequests.get = (data,callback)=>{
    callback(200,{'Success':'Friend Requests get endpoint'});

}


friendrequests.put = (data,callback)=>{
    callback(200,{'Success':'Friend Requests put endpoint'});

}

friendrequests.delete = (data,callback)=>{
    callback(200,{'Success':'Friend Requests delete endpoint'});

}



module.exports = friendrequests;