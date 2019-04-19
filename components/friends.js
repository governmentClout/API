const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const tokens = require('./../lib/tokenization');
const async = require('async');
const mailer = require('./mailer');

const con = require('./../lib/db');

friends = {};

friends.options = (data,callback)=>{

	callback(200,data.headers);
	
}

/**
 * @api {post} /friends Accept Friend Request 
 *
 * @apiName createFriend
 * @apiGroup Friends
 * @apiHeader {String} uuid Authorization UUID .
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint send friend request
 * @apiParam {String} request_uuid the uuid of the request to be accepted  
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
{
    "Success": "Friend Request Accepted"
}

 *@apiErrorExample Error-Response:
 *HTTP/1.1 401 Bad Request
{
    "Error": "Bad Request"
}

 */

friends.post = (data,callback)=>{

    let uuid = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
    let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
    
    let request_uuid = typeof(data.payload.request_sender) == 'string' && data.payload.request_sender.trim().length > 0 ? data.payload.request_sender.trim() : false;
    
    if( 
		token && 
        uuid &&
        request_uuid 

		){

            let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + uuid + "'";

            con.query(verifyToken, (err,result)=>{
                
                if(
                    !err && 
                    result[0] && 
                    result[0].token == token 
    
                    ){
                        let checkRequest = "SELECT * FROM friendrequests WHERE uuid='"+request_uuid+"'";

						con.query(checkRequest,(err,result)=>{

                            if(!err){

                                callback(200,{'Success':'Friend Request Accepted'});

                            }else{
                                console.log(err);
                                callback(500,{'Error':err})
                            }

                        })

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
                if(!request_uuid){
                    errorObject.push('Required Parameter request_uuid is missing or invalid');
                }               
        
                callback(400,{'Error':errorObject});            
        }
   
}

friends.get = (data,callback)=>{

   
    
    
    callback(200,{'Success':'Friends get endpoint'});
}

friends.delete = (data,callback)=>{
    //remove friend
    callback(200,{'Success':'Friends delete endpoint'});
}

friends.put = (data,callback)=>{
    //block/unblock
    callback(200,{'Success':'Friends put endpoint'});
}