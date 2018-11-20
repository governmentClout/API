const _db = require('./../lib/migrations');
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');

const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name

});


let polls = {};


polls.options = (data,callback)=>{

	callback(200,data.headers);
	
}

polls.post = (data,callback)=>{

	//create polls
	//respond to polls
	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid; 
	let user = typeof(uuidHeader) == 'string' && uuidHeader.trim().length > 0 ? uuidHeader.trim() : false;
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;

	let param = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let sector = typeof(data.payload.sector) == 'string' && data.payload.sector.trim().length > 0 ? data.payload.sector.trim() : false;
	let opinion = typeof(data.payload.opinion) == 'string' && data.payload.opinion.trim().length > 0 ? data.payload.opinion.trim() : false;
	let expire_at = typeof(data.payload.expire_at) == 'string' && data.payload.expire_at.trim().length > 0 ? data.payload.expire_at.trim() : '3014-01-01 00:00:00';
	let response_limit = typeof(data.payload.response_limit) == 'string' && data.payload.response_limit.trim().length > 0 ? data.payload.response_limit.trim() : '1000';
	let status = typeof(data.payload.status) == 'number' && data.payload.status.trim().length > 0 ? data.payload.status.trim() : '1';

	let queryObject = Object.keys(data.queryStringObject).length > 0 && typeof(data.queryStringObject) == 'object' ? data.queryStringObject : false;

	let poll = typeof(data.payload.poll) == 'string' && data.payload.poll.trim().length > 0 ? data.payload.poll.trim() : false;

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

				if( !param && opinion && sector ){

					//create new poll
					//user is the uuid of the creator
				
					let sqlCreatePoll = "INSERT INTO polls (uuid,sector,opinion,expire_at,response_limit,created_by) VALUES ('"+uuid+"','"+sector+"','"+opinion+"','"+expire_at+"','"+response_limit+"','" + user + "')";

					con.query(sqlCreatePoll,(err,result)=>{

						if(!err && result){

							callback(200,{'Success':'Poll Created'});

						}else{
							console.log(err);
							callback(500,{'Error':err});
						}

					});

				}

				if(!param && (!opinion || !sector)){

					let errorObject = [];
					if(!param){
						errorObject.push('No Parameter set');
					}
					if(!opinion){
						errorObject.push('Opinion required');
					}
					if(!sector){
						errorObject.push('sector is required');
					}
					console.log(errorObject);
					callback(400,{'Error':errorObject});

				}

				if(param && param == 'response'){
					// respond to a poll
					//user is the uuid of the responder, poll is the poll
					//check that user has not already responded
					//response status: 1 - true/agree/yes 2 - no/disagree/false 3 - undecided

					let checkResponse = "SELECT count(*) as count FROM polls_response WHERE user='"+user+"' and poll='" +poll+ "'";

					con.query(checkResponse,(err,result)=>{
						// console.log(result[0].count);
						if(!err && result[0].count == 0){

							
							let sqlResponse = "INSERT polls_response (user,poll,status) VALUES ('"+user+"','"+poll+"',1)";

							con.query(sqlResponse,(err,result)=>{

								if(!err && result){

									callback(200,{'Success':'response submitted'});

								}else{
									callback(500,{'Error':err});
								}

							});



						}else{
							callback(400,{'Error':'User already responded to poll'});
						}

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

polls.get = (data,callback)=>{
	
	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid; 
	let user = typeof(uuidHeader) == 'string' && uuidHeader.trim().length > 0 ? uuidHeader.trim() : false;
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;
	let param = typeof(data.payload.param) == 'string' && data.payload.param.trim().length > 0 ? data.payload.param.trim() : false;

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

					//get all polls
					//get single users polls

					if(param){
						//get for specific user
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

polls.put = (data,callback)=>{

}

polls.delete = (data,callback)=>{
	
}

module.exports = polls;
