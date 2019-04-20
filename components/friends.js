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
    
    let request_uuid = typeof(data.payload.request_uuid) == 'string' && data.payload.request_uuid.trim().length > 0 ? data.payload.request_uuid.trim() : false;
    
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

                            if(!err && result.length > 0){
                               
                                let addfriendtodb = "INSERT INTO friends (uuid,user_a,user_b) VALUES('" + uuidV1() + "','"+result[0].request_sender+ "','"+result[0].request_receiver+"')";

                                con.query(addfriendtodb,(err)=>{
                                    let deletePendingRequest = "DELETE FROM friendrequests WHERE uuid='"+request_uuid+"'";
                                    
                                    con.query(deletePendingRequest,(err)=>{

                                        if(!err){
                                            callback(200,{'Success':'Friend Request Accepted'});
                                        }else{
                                            console.log(err);
                                            callback(500,{'Error': err});
                                        }

                                    });                                   

                                });

                            }else{
                                console.log(err);
                                callback(404,{'Error':'Request Not Found'})
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

/**
 * @api {get} /friends/:uuid Get Friends  
 *
 * @apiName getSingleUserFriend
 * @apiGroup Friends
 * @apiHeader {String} uuid Authorization UUID .
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint returns all associated friends with the user
 * @apiParam {String} uuid  uuid of the usedr  
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
[
    {
        "user": [
            {
                "id": 3,
                "uuid": "48e1f9d6-fc31-40db-bfa9-3ad41dbb9cdf",
                "email": "frank4merry@gmail.com",
                "password": "70d57cc1f61eeec2306a9775a369a1641bd8bee62751554f0e638c06974eb1d6",
                "phone": "07037219054",
                "dob": "04/05/2018",
                "tosAgreement": 1,
                "provider": "email",
                "created_at": "2019-02-21T02:14:54.000Z",
                "updated_at": "2019-02-21T02:14:54.000Z",
                "status": 1
            }
        ],
        "profile": []
    },
    {
        "user": [
            {
                "id": 3,
                "uuid": "48e1f9d6-fc31-40db-bfa9-3ad41dbb9cdf",
                "email": "frank4merry@gmail.com",
                "password": "70d57cc1f61eeec2306a9775a369a1641bd8bee62751554f0e638c06974eb1d6",
                "phone": "07037219054",
                "dob": "04/05/2018",
                "tosAgreement": 1,
                "provider": "email",
                "created_at": "2019-02-21T02:14:54.000Z",
                "updated_at": "2019-02-21T02:14:54.000Z",
                "status": 1
            }
        ],
        "profile": []
    }
]

 *@apiErrorExample Error-Response:
 *HTTP/1.1 401 Bad Request
{
    "Error": [
        "You need to provide user uuid as a parameter"
    ]
}
 */

friends.get = (data,callback)=>{

   //get all friends for a person
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
                           
                            let sqlGetFriends = "SELECT * FROM friends WHERE user_a='"+param+"' OR user_b ='"+param+"'";

                            if(sort){
                                sqlGetFriends += " ORDER BY id " + sort;
                             }

                            if(limit){
                                sqlGetFriends += " LIMIT " + limit;
                            }

                            if(page){
                                
                                let skip = page == '1' ? 0 : page * limit;
                                sqlGetFriends += " OFFSET " + skip;

                            }

                            con.query(sqlGetFriends,(err,result)=>{
                                                                           
                                    if(!err && result.length > 0){
                                        console.log(result);
                                        callback(null,result);
                                    }else{
                                        console.log(err);
                                        callback(null,[]);
                                    }
                                    

                                });
                            
                        
                        },
                        function(arg, callback) {
                                                           
                            if(arg.length > 0){
                              

                                let friends = [];
                                var pending = arg.length;
                                
                                for(let i=0; i<arg.length; i++) {
                                    let selectParam = arg[i].user_a !== param ? arg[i].user_a : arg[i].user_b;

                                  con.query("SELECT * FROM profiles WHERE uuid='"+selectParam+"'; SELECT * FROM users WHERE uuid='"+selectParam+"'",(err, result)=>{
                                         
                                         
                                    friends.splice(i,0,{'uuid': arg[i].uuid ,'user': result[1],'profile':result[0]});
                                        
                                        if( 0 === --pending ) {
                                                                                            
                                               callback(null,friends);

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
 * @api {delete} /friends/:uuid Delete Friend 
 * @apiName deleteFriend
 * @apiGroup Friends
 * @apiHeader {String} uuid Authorization UUID.
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint deletes a friend from a user list of friends
 * @apiParam {String} uuid uuid of the friend to be deleted 
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *{
 *   "Success": "Friend Deleted"
 *}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 400 Bad Request
 *{
 *   "Error": [
 *       "Friend uuid not valid"
 *   ]
 *}
 * @apiErrorExample Error-Response:
 *HTTP/1.1 404 Bad Request
 *{
 *   "Error": [
 *       "Relationship not found"
 *   ]
 *}
 */

friends.delete = (data,callback)=>{

    let friend = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
    let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;
    
    if( 
		token && 
		uuidHeader &&
		friend 
		){

		let headerChecker = "SELECT * FROM tokens WHERE uuid='" + uuidHeader + "'";
		
		con.query(headerChecker,(err,results)=>{
			
			if(
                !err && 
				results && 
				results[0].token.length > 0 &&
				results[0].token == token

				){

                    let postQuery = "SELECT * FROM friends WHERE uuid='" + friend + "'";
			
                    con.query(postQuery, (err,result)=>{

                        if(!err && result[0]){

                            let deletePost = "DELETE FROM friends WHERE uuid='"+friend+"'";

                            con.query(deletePost,(err,result)=>{

                                
                                callback(200,{'Success':'Friend Deleted'});
                                    
                                
                            });

                        }else{
                            
                            callback(404,{'Error':'Friend Request not found'});
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
            if(!friend){
                errorObject.push('Friend uuid not valid');
            }
    
            callback(400,{'Error':errorObject});
        }
    

}

module.exports = friends;