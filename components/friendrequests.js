const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const tokens = require('./../lib/tokenization');
const async = require('async');
const mailer = require('./mailer');

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
    

	if( 
		token && 
        uuid &&
        request_sender &&
        request_receiver
		){
            let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + uuid + "'";

            con.query(verifyToken, (err,result)=>{
                
                if(
                    !err && 
                    result[0] && 
                    result[0].token == token 
    
                    ){

                        let checkRequest = "SELECT * FROM friendrequests WHERE request_sender='"+request_sender+"' AND request_receiver='"+request_receiver+"'; SELECT * FROM friendrequests WHERE request_sender='"+request_receiver+"' AND request_receiver='"+request_sender+"'";

						con.query(checkRequest,(err,result)=>{
							console.log('err',err);
							console.log('result',result);
							if(!err && result[0].length < 1 && result[1].length < 1){
																
								let sqlRequest = "INSERT INTO friendrequests (uuid,request_sender,request_receiver) VALUES('"+ uuidV1() +"','"+request_sender+"','"+request_receiver+"')";

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

/**
 * @api {get} /friendrequests/:uuid Send New Friend Request 
 *
 * @apiName getFriendRequest
 * @apiGroup FriendRequests
 * @apiHeader {String} uuid Authorization UUID .
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint send friend request
 * @apiParam {String} uuid uuid of the user  
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
{
    "for": [
        {
            "user": [
                {
                    "id": 1,
                    "uuid": "84b98718-04df-4d4b-a6ac-e8b9981fb5ba",
                    "email": "franko4don@gmail.com",
                    "password": "70d57cc1f61eeec2306a9775a369a1641bd8bee62751554f0e638c06974eb1d6",
                    "phone": "07037219055",
                    "dob": "04/05/2018",
                    "tosAgreement": 1,
                    "provider": "email",
                    "created_at": "2019-02-20T21:37:14.000Z",
                    "updated_at": "2019-02-20T21:37:14.000Z",
                    "status": 1
                }
            ],
            "profile": [
                {
                    "id": 2,
                    "uuid": "84b98718-04df-4d4b-a6ac-e8b9981fb5ba",
                    "nationality_origin": "Nigeria",
                    "nationality_residence": "Nigeria",
                    "state": "Delta",
                    "lga": "Lga of residence",
                    "firstName": "franklin",
                    "lastName": "Nwanze",
                    "photo": "https://res.cloudinary.com/tribenigeria-com/image/upload/v1550714823/zjb0nopimvhefa2nbuc6.jpg",
                    "created_at": "2019-02-21T01:59:30.000Z",
                    "updated_at": "2019-03-22T08:57:10.000Z",
                    "background": "https://res.cloudinary.com/tribenigeria-com/image/upload/v1550714782/epa7arhqgv8fpapb7wje.jpg"
                }
            ]
        },
        {
            "user": [
                {
                    "id": 1,
                    "uuid": "84b98718-04df-4d4b-a6ac-e8b9981fb5ba",
                    "email": "franko4don@gmail.com",
                    "password": "70d57cc1f61eeec2306a9775a369a1641bd8bee62751554f0e638c06974eb1d6",
                    "phone": "07037219055",
                    "dob": "04/05/2018",
                    "tosAgreement": 1,
                    "provider": "email",
                    "created_at": "2019-02-20T21:37:14.000Z",
                    "updated_at": "2019-02-20T21:37:14.000Z",
                    "status": 1
                }
            ],
            "profile": [
                {
                    "id": 2,
                    "uuid": "84b98718-04df-4d4b-a6ac-e8b9981fb5ba",
                    "nationality_origin": "Nigeria",
                    "nationality_residence": "Nigeria",
                    "state": "Delta",
                    "lga": "Lga of residence",
                    "firstName": "franklin",
                    "lastName": "Nwanze",
                    "photo": "https://res.cloudinary.com/tribenigeria-com/image/upload/v1550714823/zjb0nopimvhefa2nbuc6.jpg",
                    "created_at": "2019-02-21T01:59:30.000Z",
                    "updated_at": "2019-03-22T08:57:10.000Z",
                    "background": "https://res.cloudinary.com/tribenigeria-com/image/upload/v1550714782/epa7arhqgv8fpapb7wje.jpg"
                }
            ]
        }
    ],
    "from": [
        {
            "user": [
                {
                    "id": 1,
                    "uuid": "84b98718-04df-4d4b-a6ac-e8b9981fb5ba",
                    "email": "franko4don@gmail.com",
                    "password": "70d57cc1f61eeec2306a9775a369a1641bd8bee62751554f0e638c06974eb1d6",
                    "phone": "07037219055",
                    "dob": "04/05/2018",
                    "tosAgreement": 1,
                    "provider": "email",
                    "created_at": "2019-02-20T21:37:14.000Z",
                    "updated_at": "2019-02-20T21:37:14.000Z",
                    "status": 1
                }
            ],
            "profile": [
                {
                    "id": 2,
                    "uuid": "84b98718-04df-4d4b-a6ac-e8b9981fb5ba",
                    "nationality_origin": "Nigeria",
                    "nationality_residence": "Nigeria",
                    "state": "Delta",
                    "lga": "Lga of residence",
                    "firstName": "franklin",
                    "lastName": "Nwanze",
                    "photo": "https://res.cloudinary.com/tribenigeria-com/image/upload/v1550714823/zjb0nopimvhefa2nbuc6.jpg",
                    "created_at": "2019-02-21T01:59:30.000Z",
                    "updated_at": "2019-03-22T08:57:10.000Z",
                    "background": "https://res.cloudinary.com/tribenigeria-com/image/upload/v1550714782/epa7arhqgv8fpapb7wje.jpg"
                }
            ]
        }
    ]
}
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 {
    "for": [
        {
            "user": [
                {
                    "id": 5,
                    "uuid": "9b494e70-3f93-4181-bcd3-87f0ce1332ec",
                    "email": "everistusolumese@gmail.com",
                    "password": "2231306d33a58824b362898c6a1a0eb5907c74cd76928960df85d501eba90fcb",
                    "phone": "09031866339",
                    "dob": "1980-01-31T23:00:00.000Z",
                    "tosAgreement": 1,
                    "provider": "email",
                    "created_at": "2019-03-10T08:52:28.000Z",
                    "updated_at": "2019-03-10T08:52:28.000Z",
                    "status": 1
                }
            ],
            "profile": [
                {
                    "id": 3,
                    "uuid": "9b494e70-3f93-4181-bcd3-87f0ce1332ec",
                    "nationality_origin": "Vanuatu",
                    "nationality_residence": "Nigeria",
                    "state": "N/A",
                    "lga": "N/A",
                    "firstName": "Everistus",
                    "lastName": "Olumese",
                    "photo": "https://res.cloudinary.com/xyluz/image/upload/v1553172303/WEB/chelsea_ksbydb.png",
                    "created_at": "2019-03-21T12:45:04.000Z",
                    "updated_at": "2019-03-21T12:45:04.000Z",
                    "background": "false"
                }
            ]
        }
    ],
    "from": []
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
// let request_sender = typeof(data.payload.request_sender) == 'string' && data.payload.request_sender.trim().length > 0 ? data.payload.request_sender.trim() : false;
// let request_receiver
friendrequests.get = (data,callback)=>{
    
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
                               
						    	let sqlGetFriends = "SELECT * FROM friendrequests WHERE request_sender='"+param+"'";

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
						    				callback(null,result);
						    			}else{
						    				callback(null,[]);
						    			}
										

									});
						    	
						    
						    },
						    function(arg, callback) {
                               						    	
						    	if(arg.length > 0){
                                  

						    		let fromResult = [];
							    	var pending = arg.length;
							    	
							    	for(let i=0; i<arg.length; i++) {
							    		
							    	  con.query("SELECT * FROM profiles WHERE uuid='"+arg[i].request_sender+"'; SELECT * FROM users WHERE uuid='"+arg[i].request_sender+"'",(err, result)=>{
							    	 		
							    	 		
                                        fromResult.splice(i,0,{'user':result[1],'profile':result[0]});
								            
								            if( 0 === --pending ) {
                                                                                                
								               	callback(null,fromResult);

								            }

								        });
							    	}

						    	}else{
						    		callback(null, []);
						    	}						    	

						        
						    }, function(arg, callback) {
                               
						    	
                            let sqlGetFriends = "SELECT * FROM friendrequests WHERE request_receiver='"+param+"'";

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
						    				callback(null,{'partResultFor':result, 'fullResultFrom':arg});
						    			}else{
						    				callback(null,[]);
						    			}
										

									});                            

                            
                        }, function(arg, callback) {
                            
						    	
                            if(arg.partResultFor && arg.partResultFor.length > 0){
                                

                                let forResult = [];
                                var pending = arg.partResultFor.length;
                             
                                for(let i=0; i<arg.partResultFor.length; i++) {
                                    
                                  con.query("SELECT * FROM profiles WHERE uuid='"+arg.partResultFor[i].request_receiver+"'; SELECT * FROM users WHERE uuid='"+arg.partResultFor[i].request_receiver+"'",(err, result)=>{
                                         
                                         
                                    forResult.splice(i,0,{'user':result[1],'profile':result[0]});
                                       
                                        if( 0 === --pending ) {
                               

                                               callback(null,{'for':forResult, 'from':arg.fullResultFrom});

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


friendrequests.put = (data,callback)=>{
    callback(200,{'Success':'Friend Requests put endpoint'});

}

friendrequests.delete = (data,callback)=>{
    callback(200,{'Success':'Friend Requests delete endpoint'});

}



module.exports = friendrequests;