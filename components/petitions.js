const _db = require('./../lib/migrations');
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');
const tokens = require('./../lib/tokenization');
const async = require('async');

const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name,
  multipleStatements: true

});

let petitions = {};
/**
 @api {get} /petitions?page=:page&limit=:limit&sort=:sort get All Petitions 
 *
 * @apiName getUserPetitions
 * @apiGroup Petitions
 * @apiHeader {String} uuid Authorization UUID .
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint get all petitions created by the user  
 * @apiParam {String} page page you wish to get (pagination)
 * @apiParam {String} limit result count per page you wish to get (pagination)
 * @apiParam {String} sort result sort [ASC | DESC] (pagination)
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
[
    {
        "petitions": {
            "id": 2,
            "uuid": "99262d0a-9c35-472f-b757-fb9f89c2faf9",
            "user": "08390ed2-7796-41bf-bbbd-72b176ffe309",
            "targeted_office": "President",
            "petition_class": "className",
            "petition_title": "For the gods!",
            "attachment": "null",
            "created_at": "2019-04-16T21:28:15.000Z",
            "updated_at": "2019-04-16T21:28:15.000Z",
            "status": 0
        },
        "responses": [],
        "user": []
    },
    {
        "petitions": {
            "id": 3,
            "uuid": "f4af8c49-c91b-4cee-bcc7-9eed63cf0249",
            "user": "08390ed2-7796-41bf-bbbd-72b176ffe309",
            "targeted_office": "President",
            "petition_class": "className",
            "petition_title": "For the gods!",
            "attachment": "null",
            "created_at": "2019-04-16T21:56:54.000Z",
            "updated_at": "2019-04-16T21:56:54.000Z",
            "status": 0
        },
        "responses": [],
        "user": []
    },
    {
        "petitions": {
            "id": 4,
            "uuid": "fbfcbe13-d06a-4456-8020-640d571081cd",
            "user": "08390ed2-7796-41bf-bbbd-72b176ffe309",
            "targeted_office": "President",
            "petition_class": "className",
            "petition_title": "For the gods!",
            "attachment": "null",
            "created_at": "2019-04-16T21:56:56.000Z",
            "updated_at": "2019-04-16T21:56:56.000Z",
            "status": 0
        },
        "responses": [],
        "user": []
    }
]
 *@apiErrorExample Error-Response:
 *HTTP/1.1 404 Bad Request
{
    "petitions": [],
    "responses": []
}
*/
petitions.options = (data,callback)=>{

	callback(200,data.headers);
	
}
/**
 * @api {post} /petitions Create Petition 
 * @apiName createPetition
 * @apiGroup Petitions
 * @apiDescription The endpoint creates a new petition
 * @apiParam {String} targeted_office Office the petition is targetted at.
 * @apiParam {String} petition_class Class of this petition
 * @apiParam {String} petition_title Title of this petition
 * @apiParam {String} status Published 1, don't publish 0.
 * @apiParam {String} petition Content of the petition
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *{
 *   "Success": "Petition Created"
 *}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 400 Bad Request
 * {
 *   "Error": [
 *       "Petition content is required"
 *   ]
 * }
 *@apiErrorExample Error-Response:
 *HTTP/1.1 400 Bad Request
 * {
 *   "Error": [
 *       "Petition Title is required"
 *   ]
 *}
 */

petitions.post = (data,callback)=>{
	//create polls
	//respond to polls
	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid; 
	let user = typeof(uuidHeader) == 'string' && uuidHeader.trim().length > 0 ? uuidHeader.trim() : false;
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;

	let targeted_office = typeof(data.payload.targeted_office) == 'string' && data.payload.targeted_office.trim().length > 0 ? data.payload.targeted_office.trim() : false;
	let petition_class = typeof(data.payload.petition_class) == 'string' && data.payload.petition_class.trim().length > 0 ? data.payload.petition_class.trim() : false;
	let petition_title = typeof(data.payload.petition_title) == 'string' && data.payload.petition_title.trim().length > 0 ? data.payload.petition_title.trim() : false;
	let status = typeof(data.payload.status) == 'string' && data.payload.status.trim().length > 0 ? data.payload.status.trim() : '1';
	let petition = typeof(data.payload.petition) == 'string' && data.payload.petition.trim().length > 0 ? data.payload.petition.trim() : false;
	let attachment = typeof(data.payload.attachment) == 'object' && data.payload.attachment.length > 0  ? data.payload.attachment : null;

	//@TODO: Change petition attachment to comma separated strings

	let uuid = uuidV1();


	if( 
		token && 
		uuidHeader 

		){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

		con.query(verifyToken, (err,result)=>{
				
			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){

				if( targeted_office && 
					petition_class &&
					petition &&
					petition_title
					){

					if(attachment){
							attachment = JSON.stringify(attachment);
						}

					let sqlCreatePetition = "INSERT INTO petitions (uuid,user,targeted_office,petition_class,petition_title,attachment,status) VALUES ('"+uuid+"','"+user+"','"+targeted_office+"','"+petition_class+"','"+petition_title+"','" + attachment + "','0')";

					con.query(sqlCreatePetition,(err,result)=>{

						if(!err && result){

							callback(200,{'Success':'Petition Created'});

						}else{
							console.log(err);
							callback(500,{'Error':err});
						}

					});

				}else{

					let errorObject = [];

					if(!targeted_office){
						errorObject.push('Targeted Office is a required field');
					}
					if(!petition_class){
						errorObject.push('Petition Class is required');
					}
					if(!petition){
						errorObject.push('Petition content is required');
					}
					if(!petition_title){
						errorObject.push('Petition Title is required');
					}


					console.log(errorObject);
					callback(400,{'Error':errorObject});

				}

				
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
 * @api {get} /petitions/:uuid get Single Petition 
 * @apiName getSinglePetition
 * @apiGroup Petitions
 * @apiHeader {String} uuid Authorization UUID.
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint deletes a petition
 * @apiParam {String} uuid UUID of the pedition
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
{
    "petitions": [
        {
            "id": 2,
            "uuid": "99262d0a-9c35-472f-b757-fb9f89c2faf9",
            "user": "08390ed2-7796-41bf-bbbd-72b176ffe309",
            "targeted_office": "President",
            "petition_class": "className",
            "petition_title": "For the gods!",
            "attachment": "null",
            "created_at": "2019-04-16T21:28:15.000Z",
            "updated_at": "2019-04-16T21:28:15.000Z",
            "status": 0
        }
    ],
    "responses": []
}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 404 Bad Request
{
    "petitions": [],
    "responses": []
}

*/

petitions.get = (data,callback)=>{
	
	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid; 
	let user = typeof(uuidHeader) == 'string' && uuidHeader.trim().length > 0 ? uuidHeader.trim() : false;
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;
	let param = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let userPetition = typeof(data.queryStringObject.user) == 'string' && data.queryStringObject.user.trim().length > 0 ? data.queryStringObject.user.trim() : false; //should be ?user={uuid}


	let page = typeof(data.queryStringObject.page) == 'string'  ? data.queryStringObject.page : '1'; 
	let limit = typeof(data.queryStringObject.limit) == 'string' ? data.queryStringObject.limit : '10';
	let sort = typeof(data.queryStringObject.sort) == 'string' && data.queryStringObject.sort.trim().length > 0 && (data.queryStringObject.sort.trim() == 'ASC' || 'DESC') ? data.queryStringObject.sort.trim() : 'DESC';


	if( 
		token && 
		uuidHeader 

		){


			let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

			con.query(verifyToken, (err,result)=>{
				
				if(
					!err && 
					result[0] && 
					result[0].token == token 

					){

					//get all petitions
					//get single users petitions
					//get all petitions response


					if(userPetition){
						
						//then get polls belonging to a single user
						
						let finalresult = [];
						//just get everything and give it to them
						async.waterfall([
					    function(callback) {
					    	let sql = "SELECT * FROM petitions WHERE user='"+user+"'";

					    	if(sort){
					    		sql += " ORDER BY id " + sort;
 					    	}

					    	if(limit){
					    		sql += " LIMIT " + limit;
					    	}

					    	if(page){
					    		
					    		let skip = page == '1' ? 0 : page * limit;
					    		sql += " OFFSET " + skip;

					    	}

					    	con.query(sql,(err,result)=>{
					    		console.log(result);
									callback(null,result);

								});
					    	
					    
					    },
					    function(arg, callback) {
					    	
					    	let result = [];
					    	var pending = arg.length;

					    	for(let i=0; i<arg.length; i++) {
					    		
					    	 con.query("SELECT * FROM polls_response WHERE poll='"+arg[i].uuid+"'; SELECT firstName,lastName,photo from profiles where uuid='"+arg[i].created_by+"'",(err, compile)=>{
					    	 		console.log(compile);
					    	 		let polls = arg[i];
					    	 		
						            finalresult.splice(i,0,{'polls':arg[i],'responses':compile[0], 'user':compile[1]});
						            

						            if( 0 === --pending ) {

						               	callback(null, finalresult);

						            }

						        });
					    	}

					        
					    }
					], function (err, result) {
						console.log(result);
						callback(200,result);
					});
				}

					

					if(param){
						
						//get single poll and all respoonse with profile of the responders

						let finalresult = [];
						//just get everything and give it to them
						async.waterfall([
					    function(callback) {
					    	let sql = "SELECT * FROM petitions WHERE uuid='"+param+"'";

					    	if(sort){
					    		sql += " ORDER BY id " + sort;
 					    	}

					    	if(limit){
					    		sql += " LIMIT " + limit;
					    	}

					    	if(page){
					    		
					    		let skip = page == '1' ? 0 : page * limit;
					    		sql += " OFFSET " + skip;

					    	}

					    	con.query(sql,(err,result)=>{
								
									callback(null,result);

								});
					    	
					    
					    },
					    function(arg, callback) {
					    	
					    	let result = [];
					    	var pending = arg.length;
					    
					    		
					    	 con.query("SELECT * FROM petitions_response WHERE poll='"+arg.uuid+"'; SELECT firstName,lastName,photo from profiles where uuid='"+arg.user+"'",(err, compile)=>{
					    	 		if(compile){
										callback(null, {'petitions':arg,'response':compile[0], 'user':compile[1]});
									 }else{
										callback(null, {'petitions':arg,'response':[], 'user':[]});
									 }
						              	

						        });
					    

					        
					    },
					     function(arg, callback) {

					     	
					    	let result = [];
					    	var pending = arg.response.length;
					    	let petitions = arg.petitions;
					    	let responses = arg.response;
					  
					    	if(responses.length > 0){

					    		for(let i=0; i<pending; i++) {
					    		
						    	 con.query("SELECT * FROM profiles WHERE uuid='"+responses[i].user+"'",(err, users)=>{
						    	 	
							            finalresult.splice(i,0,users);
							            
							            if( 0 === --pending ) {
							            	
							               	callback(null, {'petitions':poll,'responses':finalresult});

							            }

							        });
						    	}

					    	}else{
					    		callback(null, {'petitions':petitions,'responses':[]});
					    	}
					    	

					        
					    }
					], function (err, result) {
						
						callback(200,{'petitions':result.petitions,'responses':result.responses});
					});
					

					}

					if(!param && !userPetition){
						
						let finalresult = [];
						//just get everything and give it to them
						async.waterfall([
					    function(callback) {
					    	let sql = "SELECT * FROM petitions";

					    	con.query(sql,(err,result)=>{
								
									callback(null,result);

								});
					    	
					    
					    },
					    function(arg, callback) {
					    	
					    	let result = [];
					    	var pending = arg.length;

					    	for(let i=0; i<arg.length; i++) {
					    		
					    	 con.query("SELECT * FROM petitions_sign WHERE petition='"+arg[i].uuid+"'; SELECT firstName,lastName, photo from profiles where uuid='"+arg[i].user+"'",(err, compile)=>{
					    	 		
					    	 		let petition = arg[i];
					    	 		
						            finalresult.splice(i,0,{'petitions':arg[i],'responses':compile[0], 'user':compile[1]});
						          
						            if( 0 === --pending ) {

						               	callback(null, finalresult);

						            }

						        });
					    	}

					        
					    }
					], function (err, result) {
						
						callback(200,result);

					});
					}



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
* @api {get} /petitions?user=:uuid&page=:page&limit=:limit&sort=:sort get Users Petitions 
 *
 * @apiName getUserPetitions
 * @apiGroup Petitions
 * @apiHeader {String} uuid Authorization UUID .
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint get all petitions created by the user
 * @apiParam {String} uuid User that owns the petitions  
 * @apiParam {String} page page you wish to get (pagination)
 * @apiParam {String} limit result count per page you wish to get (pagination)
 * @apiParam {String} sort result sort [ASC | DESC] (pagination)
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
{
    "petitions": [
        {
            "id": 2,
            "uuid": "99262d0a-9c35-472f-b757-fb9f89c2faf9",
            "user": "08390ed2-7796-41bf-bbbd-72b176ffe309",
            "targeted_office": "President",
            "petition_class": "className",
            "petition_title": "For the gods!",
            "attachment": "null",
            "created_at": "2019-04-16T21:28:15.000Z",
            "updated_at": "2019-04-16T21:28:15.000Z",
            "status": 0
        }
    ],
    "responses": []
}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 404 Bad Request
{
    "petitions": [],
    "responses": []
}

 */

petitions.put = (data,callback)=>{
	//to sign petition
	callback(200,{'Success':'You have hit the petition get endpoint'});
}

/**
 * @api {delete} /petitions/:uuid Delete Petition 
 * @apiName deletePetition
 * @apiGroup Petitions
 * @apiHeader {String} uuid Authorization UUID.
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint deletes a petition
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
 *{
 *   "Success": "Petition Deleted"
 *}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 400 Bad Request
 *{
 *   "Error": [
 *       "Petition uuid not valid"
 *   ]
 *}
 */

petitions.delete = (data,callback)=>{

	let petition = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;

	if( 
		token && 
		uuidHeader &&
		petition 
		){

		let headerChecker = "SELECT * FROM tokens WHERE uuid='" + uuidHeader + "'";
		
		con.query(headerChecker,(err,results)=>{
			
			if(!err && 
				results && 
				results[0].token.length > 0 &&
				results[0].token == token

				){

				let postQuery = "SELECT * FROM petitions WHERE uuid='" + petition + "'";
			
				con.query(postQuery, (err,result)=>{

					if(!err && result[0]){

						let deletePost = "DELETE FROM petitions WHERE uuid='"+petition+"'";

						con.query(deletePost,(err,result)=>{

							
							callback(200,{'Success':'Petition deleted'});
								
							
						});

					}else{
						console.log(err);
						callback(404,{'Error':'Petition not found'});
					}

				})

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
		if(!petition){
			errorObject.push('Petition uuid not valid');
		}

		callback(400,{'Error':errorObject});
	}

}




module.exports = petitions;

