
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

signatures.get = (data,callback)=>{
    callback(200,{'Success':'Signature Get endpoint'});
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
    "Success": "Petition Signed"
}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 405 Bad Request
{
    "Error": "User already signed this petition"
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
                                    
                                    let sqlResponse = "DELETE petitions_sign WHERE user='"+user+"' AND petition='"+petition+"'";

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
