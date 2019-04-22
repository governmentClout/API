
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const tokens = require('./../lib/tokenization');
const async = require('async');
const mailer = require('./mailer');

const con = require('./../lib/db');


replymessages = {};

replymessages.options = (data,callback)=>{

	callback(200,data.headers);
	
}
/**
 * @api {post} /replymessages Send New Reply  
 *
 * @apiName sendNewReply
 * @apiGroup Messages
 * @apiHeader {String} uuid Authorization UUID .
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint allows you to reply message
 * @apiParam {String} sender uuid of the user sending the reply  
 * @apiParam {String} receiver uuid of the user to receive the reply
 * @apiParam {String} message uuid of the message this reply is associated with
 * @apiParam {String} content content of the reply to be sent
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
{
    "Success": "Reply Sent"
}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 405 Bad Request
{
    "Error": "No relationship between sender and receiver"
}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 405 Bad Request
{
    "Error": [
        "Required Parameter sender is missing or invalid",
        "Required Parameter receiver is missing or invalid",
        "Required Parameter content is missing or invalid"
    ]
}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 404 Bad Request
{
    "Error": "Message not found"
}

 */

replymessages.post = (data,callback)=>{
    
    let uuid = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
    let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
    
    let sender = typeof(data.payload.sender) == 'string' && data.payload.sender.trim().length > 0 ? data.payload.sender.trim() : false;
    let receiver = typeof(data.payload.receiver) == 'string' && data.payload.receiver.trim().length > 0 ? data.payload.receiver.trim() : false;
    let content = typeof(data.payload.content) == 'string' && data.payload.content.trim().length > 0 ? data.payload.content.trim() : false;
    let message = typeof(data.payload.message) == 'string' && data.payload.message.trim().length > 0 ? data.payload.message.trim() : '';

    if( 
		token && 
        uuid &&
        sender &&
        receiver &&
        content &&
        message

		){
          
            if(sender == receiver){
                callback(401,{'Error':'You cannot send reply to yourself'});
            }

            let verifyToken = "SELECT token,uuid FROM " + config.db_name + ".tokens WHERE uuid='" + uuid + "'";

            con.query(verifyToken, (err,result)=>{
               
                if(
                    !err && 
                    result[0] && 
                    result[0].token == token &&
                    result[0].uuid == sender 

    
                    ){
                      
                        let checkRequest = "SELECT * FROM friends WHERE user_a='"+receiver+"' AND user_b='"+sender+"'; SELECT * FROM friends WHERE user_b='"+receiver+"' AND user_a='"+sender+"'";

                        con.query(checkRequest,(err,result)=>{
                          
                            if(!err && 
                                result[0].length > 0 || 
                                result[1].length > 0  
                                                               
                                ){
                                   //check if message exists
                                   let checkMessage = "SELECT * FROM messages WHERE uuid='"+message+"'";

                                   con.query(checkMessage,(err,result)=>{
                                    
                                    if(!err && 
                                        result.length > 0 &&
                                        ( result[0].sender == sender ||
                                        result[0].sender == receiver ) && 
                                        ( result[0].receiver == sender ||
                                            result[0].receiver == receiver )                                        
                                        ){

                                        let sqlReply = "INSERT INTO replies (uuid,sender,receiver,content,message) VALUES('"+ uuidV1() +"','"+sender+"','"+receiver+"','"+content+"','"+message+"')";

                                        con.query(sqlReply,(err)=>{

                                            if(!err){

                                                mailer.sendByUUID({
                                                    'uuid':receiver,
                                                    'subject':'Notification: New Reply Message',
                                                    'message':'You have a new message'
                                                    });
    
                                            callback(200,{'Success':'Reply Sent'});

                                            }else{
                                            //@TODO: Change this error message to a more friendly error
                                        
                                            callback(500,{'Error':err});
                                            
                                        }

                                        });


                                    }else{
                                        console.log(err);
                                        callback(404,{'Error':'Message not found'});
                                    }

                                   });
                                    
                                }else{

                                    let errorObject = [];
    
                                    if(err){
                                        errorObject.push(err);
                                    }
    
                                    if(result[0].length < 1 || result[1].length < 1){
                                        errorObject.push('No relationship between sender and receiver');
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
                if(!sender){
                    errorObject.push('Required Parameter sender is missing or invalid');
                }
                if(!receiver){
                    errorObject.push('Required Parameter receiver is missing or invalid');
                }
                if(!content){
                    errorObject.push('Required Parameter content is missing or invalid');
                }
                if(!message){
                    errorObject.push('Required Parameter message uuid is missing or invalid');
                }
        
                callback(400,{'Error':errorObject});       
            
        }

}

/**
 * @api {get} /replymessages/:uuid Get Reply   
 *
 * @apiName getSentMessages
 * @apiGroup Messages
 * @apiHeader {String} uuid Authorization UUID .
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint returns all replies associated with a message
 * @apiParam {String} uuid uuid of the message  
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 
 *@apiErrorExample Error-Response:
 *HTTP/1.1 400 Bad Request
{
    "Error": [
        "You need to provide user uuid as a parameter"
    ]
}
 */


replymessages.get = (data,callback)=>{
    
    // get all messages this user has sent
    let uuid = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
    let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;

    let param = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;

    let queryObject = Object.keys(data.queryStringObject).length > 0 && typeof(data.queryStringObject) == 'object' ? data.queryStringObject : false;

    let page = typeof(data.queryStringObject.page) == 'string'  ? data.queryStringObject.page : '1'; 
	let limit = typeof(data.queryStringObject.limit) == 'string' ? data.queryStringObject.limit : '10';
	let sort = typeof(data.queryStringObject.sort) == 'string' && data.queryStringObject.sort.trim().length > 0 && (data.queryStringObject.sort.trim() == 'ASC' || 'DESC') ? data.queryStringObject.sort.trim() : 'DESC';

    
    if( 
		token && 
		uuid &&
        param
		){

            let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + uuid + "'";

            con.query(verifyToken, (err,result)=>{

                if(
                    !err && 
                    result[0] && 
                    result[0].token == token 

                    ){

                        async.waterfall([
                            function(callback) {
                               
						    	let sqlGetReplies = "SELECT * FROM replies WHERE message='"+param+"'";

						    	if(sort){
						    		sqlGetReplies += " ORDER BY id " + sort;
	 					    	}

						    	if(limit){
						    		sqlGetReplies += " LIMIT " + limit;
						    	}

						    	if(page){
						    		
						    		let skip = page == '1' ? 0 : page * limit;
						    		sqlGetReplies += " OFFSET " + skip;

						    	}

						    	con.query(sqlGetReplies,(err,result)=>{
                                   						    				
						    			if(!err && result.length > 0){
						    				callback(null,result);
						    			}else{
						    				callback(null,[]);
						    			}
										

									});
						    	
						    
						    },function(arg, callback) {
                            
						    	
                                if(arg && arg.length > 0){
                                    
    
                                    let replies = [];
                                    var pending = arg.length;
                                 
                                    for(let i=0; i<arg.length; i++) {
                                        
                                      con.query("SELECT * FROM profiles WHERE uuid='"+arg[i].sender+"'; SELECT * FROM users WHERE uuid='"+arg[i].sender+"'",(err, result)=>{
                                             
                                             
                                        replies.splice(i,0,{'reply':arg[i],'sender':result[1],'sender_profile':result[0]});
                                           
                                            if( 0 === --pending ) {
                                   
    
                                                   callback(null,{'success':replies});
    
                                            }
    
                                        });
                                    }
    
                                }else{
                                    callback(null, []);
                                }
                                
    
                                
                            }
                            
                        ], function (err, result) {
                                                        
                                callback(200,result);
    
                            });

                    }else{

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
        
        if(!param){
            errorObject.push('You need to provide user uuid as a parameter');
        }

		callback(400,{'Error':errorObject});

	}

}

/**
 * @api {delete} /sendmessages/:uuid Delete Message 
 * @apiName deleteMessage
 * @apiGroup Messages
 * @apiHeader {String} uuid Authorization UUID.
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint deletes a message from the sender and the receiver
 * @apiParam {String} uuid uuid of the Message to be deleted 
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *{
 *   "Success": "Message permanently Deleted"
 *}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 400 Bad Request
 *{
 *   "Error": [
 *       "Message uuid not valid"
 *   ]
 *}
 * @apiErrorExample Error-Response:
 *HTTP/1.1 404 Bad Request
 *{
 *   "Error": [
 *       "Message not found"
 *   ]
 *}
 */

replymessages.delete = (data,callback)=>{

    let message = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;

	if( 
		token && 
		uuidHeader &&
        message
         
		){

            let headerChecker = "SELECT * FROM tokens WHERE uuid='" + uuidHeader + "'";
		
		con.query(headerChecker,(err,results)=>{
			
			if(!err && 
				results && 
				results[0].token.length > 0 &&
                results[0].token == token                 

				){
                    let postQuery = "SELECT * FROM messages WHERE uuid='" + message + "'";
			
                    con.query(postQuery, (err,result)=>{
                           
                        if(!err && result.length > 0 && result[0].sender == results[0].uuid){

                            let deletePost = "DELETE FROM friendrequests WHERE uuid='"+message+"'";

						con.query(deletePost,(err)=>{

							
                            if(!err){
                                callback(200,{'Success':'Message Deleted'});
                            }else{
                                callback(500,{'Error':err});
                            }
								
							
						});

                        }else{

                            let errorObject = [];
    
                            if(err){
                                errorObject.push(err);
                            }
                            
                            if(!result){
                                errorObject.push('Message not found');
                            }
                            else if(result.length < 1){

                                errorObject.push('Message not found');
                               
                            }else{
                                if(result.sender != results[0].uuid){
                                    errorObject.push('Unauthorized! You can only deleted your own messages');
                                }
                            }

                            callback(400,{'Error':errorObject});
                        }

                    });

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
            if(!message){
                errorObject.push('Message uuid not valid');
            }
    
            callback(400,{'Error':errorObject});
        }
    
}


module.exports = replymessages;
