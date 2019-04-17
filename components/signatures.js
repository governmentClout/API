
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');
const tokens = require('./../lib/tokenization');

const con = require('../lib/db');


signatures = {};

signatures.options = (data,callback)=>{

	callback(200,data.headers);
	
}

/**
 * @api {post} /signatures Sign Petition 
 *
 * @apiName signPetition
 * @apiGroup Petitions
 * @apiHeader {String} uuid Authorization UUID .
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint signs a petition
 * @apiParam {String} user uuid of the user signing  
 * @apiParam {String} petition uuid of the petition to be signed
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
{
    "Success": "Petition Signed"
}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 405 Bad Request
{
    "Error": "User already signed this petition"
}

 */

signatures.post = (data,callback)=>{

    let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
    let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
    
    let petition = typeof(data.payload.petition) == 'string' && data.payload.petition.trim().length > 0 ? data.payload.petition.trim() : false;
    let user = typeof(data.payload.user) == 'string' && data.payload.user.trim().length > 0 ? data.payload.user.trim() : false;

    let uuid = uuidV1();

	if( 
		token && 
        uuidHeader &&
        petition &&
        user

		){

            let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

            con.query(verifyToken, (err,result)=>{

                if(
                    !err && 
                    result[0] && 
                    result[0].token == token 
    
                    ){
    

                    let checkResponse = "SELECT count(*) as count FROM petitions_sign WHERE user='"+user+"' and petition='" +petition+ "'";

                            con.query(checkResponse,(err,result)=>{
                                
                                if(!err && result[0].count == 0){
                                    
                                    let sqlResponse = "INSERT petitions_sign (uuid,user,petition) VALUES ('" + uuid + "','" + user+"','"+petition+"')";

                                    con.query(sqlResponse,(err,result)=>{

                                        if(!err && result){

                                            callback(200,{'Success':'Petition Signed'});

                                        }else{
                                            callback(500,{'Error':err});
                                        }
        
                                    });



                                }else{
                                    callback(400,{'Error':'User already signed this petition'});
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
        if(!user){
			errorObject.push('Required Parameter user is missing');
        }
        if(!petition){
			errorObject.push('Required Parameter petition uuid is missing');
		}
		if(!uuidHeader){
			errorObject.push('uuid in the header not found');
		}

		callback(400,{'Error':errorObject});

	}
}

/**
 * @api {get} /signatures/:uuid Get single petition signatures 
 *
 * @apiName singlePetitionSignature
 * @apiGroup Petitions
 * @apiHeader {String} uuid Authorization UUID .
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint signs a petition
 * @apiParam {String} uuid uuid of the petition  
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
{
    "signatures": [
        {
            "id": 2,
            "uuid": "2bebbf3e-dd44-4574-86ad-be9fff37a665",
            "petition": "99262d0a-9c35-472f-b757-fb9f89c2faf9",
            "user": "08390ed2-7796-41bf-bbbd-72b176ffe309",
            "created_at": "2019-04-17T12:36:31.000Z",
            "updated_at": "2019-04-17T12:36:31.000Z",
            "status": 0
        }
    ]
}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 404 Bad Request
{
    []
}

 */

signatures.get = (data,callback)=>{
    //get all signatures for a particular petition
    
    let uuid = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
    let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
    
    let petition = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;

    if( 
		token && 
		uuid 

		){
            let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + uuid + "'";

			con.query(verifyToken, (err,result)=>{
				
				if(
					!err && 
					result[0] && 
					result[0].token == token 

					){
                        let sql = "SELECT * FROM petitions_sign WHERE petition='"+petition+"'";

                        con.query(sql, (err,result)=>{

                            if(!err && result.length > 0){

                                callback(200,{'signatures':result});

                            }else{
                                callback(404,[]);
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
		if(!uuidHeader){
			errorObject.push('uuid in the header not found');
		}

		callback(400,{'Error':errorObject});

	}
}

/**
 * @api {delete} /signatures Remote Signature from Petition 
 *
 * @apiName unsignPetition
 * @apiGroup Petitions
 * @apiHeader {String} uuid Authorization UUID .
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint signs a petition
 * @apiParam {String} user uuid of the user  
 * @apiParam {String} petition uuid of the petition to be unsigned
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
{
    "Success": "Petition Un Signed"
}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 404 Bad Request
{
    "Error": "User Signed Petition Not Found"
}

 */

signatures.delete = (data,callback)=>{
    
    let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
    let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;

    let petition = typeof(data.payload.petition) == 'string' && data.payload.petition.trim().length > 0 ? data.payload.petition.trim() : false;
    let user = typeof(data.payload.user) == 'string' && data.payload.user.trim().length > 0 ? data.payload.user.trim() : false;

    let uuid = uuidV1();

	if( 
		token && 
        uuidHeader &&
        petition &&
        user

		){

            let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

            con.query(verifyToken, (err,result)=>{

                if(
                    !err && 
                    result[0] && 
                    result[0].token == token 
    
                    ){
    

                    let checkResponse = "SELECT count(*) as count FROM petitions_sign WHERE user='"+user+"' and petition='" +petition+ "'";

                            con.query(checkResponse,(err,result)=>{
                                
                                if(!err && result[0].count != 0){
                                    
                                    let sqlResponse = "DELETE FROM petitions_sign WHERE user='"+user+"' AND petition='"+petition+"'";

                                    con.query(sqlResponse,(err,result)=>{

                                        if(!err){

                                            callback(200,{'Success':'Petition Un Signed'});

                                        }else{
                                            callback(500,{'Error':err});
                                        }
        
                                    });



                                }else{
                                    callback(400,{'Error':'User Signed Petition Not Found'});
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
        if(!user){
			errorObject.push('Required Parameter user is missing');
        }
        if(!petition){
			errorObject.push('Required Parameter petition uuid is missing');
		}
		if(!uuidHeader){
			errorObject.push('uuid in the header not found');
		}

		callback(400,{'Error':errorObject});

	}
}


module.exports = signatures;
