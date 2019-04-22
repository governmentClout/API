
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const tokens = require('./../lib/tokenization');
const async = require('async');
const mailer = require('./mailer');

const con = require('./../lib/db');


sendmessages = {};

sendmessages.options = (data,callback)=>{

	callback(200,data.headers);
	
}
/**
 * @api {post} /sendmessages Send New Message 
 *
 * @apiName sendNewMessage
 * @apiGroup Messages
 * @apiHeader {String} uuid Authorization UUID .
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint allows you to send a message to another user
 * @apiParam {String} sender uuid of the user sending the message  
 * @apiParam {String} receiver uuid of the user to receive the message
 * @apiParam {String} content content of the message to be sent
 * @apiParam {String} attachments coma separated url of the images attached to this message
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
{
    "Success": "Message Sent"
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

 */

sendmessages.post = (data,callback)=>{
    
    let uuid = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
    let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
    
    let sender = typeof(data.payload.sender) == 'string' && data.payload.sender.trim().length > 0 ? data.payload.sender.trim() : false;
    let receiver = typeof(data.payload.receiver) == 'string' && data.payload.receiver.trim().length > 0 ? data.payload.receiver.trim() : false;
    let content = typeof(data.payload.content) == 'string' && data.payload.content.trim().length > 0 ? data.payload.content.trim() : false;
    let attachments = typeof(data.payload.attachments) == 'string' && data.payload.attachments.trim().length > 0 ? data.payload.attachments.trim() : '';

    if( 
		token && 
        uuid &&
        sender &&
        receiver &&
        content 

		){
          
            if(sender == receiver){
                callback(401,{'Error':'You cannot send message to yourself'});
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
                                   
                                    let sqlRequest = "INSERT INTO messages (uuid,sender,receiver,content,attachments) VALUES('"+ uuidV1() +"','"+sender+"','"+receiver+"','"+content+"','"+attachments+"')";

                                    con.query(sqlRequest,(err)=>{

                                        if(!err){

                                            mailer.sendByUUID({
                                                'uuid':receiver,
                                                'subject':'Notification: New Message',
                                                'message':'You have a new message'
                                                });
 
                                         callback(200,{'Success':'Message Sent'});

                                        }else{
                                        //@TODO: Change this error message to a more friendly error
                                       
                                        callback(500,{'Error':err});
                                        
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
        
                callback(400,{'Error':errorObject});       
            
        }

}

/**
 * @api {get} /sendmessages/:uuid Get Messages this user has sent 
 *
 * @apiName getSentMessages
 * @apiGroup Messages
 * @apiHeader {String} uuid Authorization UUID .
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint returns all messages this user has sent
 * @apiParam {String} uuid uuid of the user  
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
{

}

 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 {
     []
 }
 *@apiErrorExample Error-Response:
 *HTTP/1.1 404 Bad Request
{
    "Error": [
        "You need to provide user uuid as a parameter"
    ]
}
 */


sendmessages.get = (data,callback)=>{
    
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
                               
						    	let sqlGetMessages = "SELECT * FROM messages WHERE sender='"+param+"'";

						    	if(sort){
						    		sqlGetMessages += " ORDER BY id " + sort;
	 					    	}

						    	if(limit){
						    		sqlGetMessages += " LIMIT " + limit;
						    	}

						    	if(page){
						    		
						    		let skip = page == '1' ? 0 : page * limit;
						    		sqlGetMessages += " OFFSET " + skip;

						    	}

						    	con.query(sqlGetMessages,(err,result)=>{
                                   						    				
						    			if(!err && result.length > 0){
						    				callback(null,result);
						    			}else{
						    				callback(null,[]);
						    			}
										

									});
						    	
						    
						    }function(arg, callback) {
                            
						    	
                                if(arg && arg.length > 0){
                                    
    
                                    let messages = [];
                                    var pending = arg.length;
                                 
                                    for(let i=0; i<arg.length; i++) {
                                        
                                      con.query("SELECT * FROM profiles WHERE uuid='"+arg[i].receiver+"'; SELECT * FROM users WHERE uuid='"+arg[i].receiver+"'",(err, result)=>{
                                             
                                             
                                        messages.splice(i,0,{'uuid':arg.receiver,'user':result[1],'profile':result[0]});
                                           
                                            if( 0 === --pending ) {
                                   
    
                                                   callback(null,{'messages':messages});
    
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

sendmessages.delete = (data,callback)=>{
    callback(200,{'Success':'You have hit delete endpoint'});
    //delete message sent by this user
}


module.exports = sendmessages;
