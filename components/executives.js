
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');
const mailer = require('./mailer');
const con = require('../lib/db');

executives = {}; 

executives.options = (data,callback)=>{

	callback(200,data.headers);
	
}


/**
 * @api {get} /executives/:uuid Get Executive Status
 *
 * @apiName getUpgradeStatus
 * @apiGroup Executives
 * @apiHeader {String} uuid Authorization UUID .
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint checks if user is already an executive or if the user request is already pending 
 * @apiParam {String} uuid the uuid of the user 
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
[
    {
        "id": 2,
        "uuid": "3e6cd047-3185-410f-8c53-bab4d897f5af",
        "user": "9b494e70-3f93-4181-bcd3-87f0ce1332ec",
        "party": "testparty",
        "admin": "null",
        "about_you": "Just here to test if i can become an exco",
        "about_party": "this should actually be just one",
        "office": "Chairman",
        "created_at": "2019-04-23T18:08:30.000Z",
        "updated_at": "2019-04-23T18:08:30.000Z",
        "status": 0
    }
]
 *@apiErrorExample Error-Response:
 *HTTP/1.1 404 Bad Request
{
   {}
}

 */

executives.get = (data,callback)=>{

	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;

	let user = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	
	if( 
		token && 
		uuidHeader 
		 
		){

			let headerChecker = "SELECT * FROM tokens WHERE uuid='" + uuidHeader + "'";		
		
			con.query(headerChecker,(err,results)=>{

				if(!err && results.length > 0 ){

						if(user){

							let sqlCheckRequest = "SELECT * FROM executives WHERE user='"+user+"'";

							con.query(sqlCheckRequest,(err,result)=>{

								if(!err && result.length > 0){

									callback(200,result);

								}else{
									callback(404,{});
								}

							});
							
						}else{
							callback(404,{'Error':'Missing uuid in parameter'});
						}

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
	
			callback(400,{'Error':errorObject});
		}

	// callback(200,{'success':'you have hit executives get endpoint'})

}

/**
 * @api {post} /executives Request Upgrade 
 *
 * @apiName requestUpgrade
 * @apiGroup Executives
 * @apiHeader {String} uuid Authorization UUID .
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint create a new upgrade request for user to become an executive
 * @apiParam {String} user the uuid of the user submitting the request
 * @apiParam {String} party the party the user belongs to
 * @apiParam {String} about_you information about this user
 * @apiParam {String} about_party say something about this party in this user's perspective
 * @apiParam {String} district constituency/location if applicable
 * @apiParam {String} state Which state
 * @apiParam {String} lga Which lga
 * @apiParam {String} office Position user holds in party  
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
{
    "Success": "Upgrade Request Sen"
}

 *@apiErrorExample Error-Response:
 *HTTP/1.1 401 Bad Request
{
    "Error": [
        "User already an executive"
    ]
}

 */


executives.post = (data,callback)=>{
	//request to become an executve
	let user = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let party = typeof(data.payload.party) == 'string' && data.payload.party.trim().length > 0 ? data.payload.party.trim() : false;
	let about_you = typeof(data.payload.about_you) == 'string' && data.payload.about_you.trim().length > 0 ? data.payload.about_you.trim() : false;
	let about_party = typeof(data.payload.about_party) == 'string' && data.payload.about_party.trim().length > 0 ? data.payload.about_party.trim() : false;
	let office = typeof(data.payload.office) == 'string' && data.payload.office.trim().length > 0 ? data.payload.office.trim() : false;
	let uuid = uuidV1();

	if(user && token){

		let verifyToken = "SELECT token,uuid FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

		con.query(verifyToken, (err,result)=>{
			
			if(
				!err && 
				result[0] && 
				result[0].token == token &&
				result[0].uuid == user

				){
				
				let sqlCheckRequest = "SELECT * FROM executives WHERE user='"+user+"'";

				con.query(sqlCheckRequest,(err,result)=>{

					if(!err && result.length < 1){

						if(!about_you){
							about_you = '';
						}
						if(!about_party){
							about_party = '';
						}

						let sqlCreateExecutiveRequest = "INSERT INTO executives (uuid,user,party,about_you,about_party,office,admin) VALUES('"+uuid+"','"+user+"','"+party+"','"+about_you+"','"+about_party+"','"+office+"','null')";

						con.query(sqlCreateExecutiveRequest,(err,result)=>{

							if(!err){

								//send email
								mailer.sendByUUID({
						   					'uuid':user,
						   					'subject':'Upgrade Request Submitted',
						   					'message':'Your upgrade request to become an executive has been submitted'
						   					});

								callback(200,{'Success':'Upgrade Request Sent'});

							}else{
								console.log(err);
								callback(500,{'Error':'Request not submitted, something went wrong'});
							}

						});

					}else{

						let errorObject = [];

						if(err){

							errorObject.push(err);

						}

						if(result.status = 1){
							errorObject.push('Request already pending');
						}

						if(result.status = 0){
							errorObject.push('User already an executive');
						}

						callback(400,{'Error':errorObject});
					}

				});

			}else{
					callback(405,{'Error':'Token invalid or mismatch'});
				}
	});

	}else{

		let errorObject = [];

		if(!user){
			errorObject.push('Missing header uuid 1');
		}
		if(!token){
			errorObject.push('Missing header token');
		}

		callback(400,{'Error':errorObject});
	}

}



module.exports = executives;
