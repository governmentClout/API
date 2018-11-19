
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');
const tokens = require('./../lib/tokenization');
const uploader = require('./uploader');

const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name

});

let profiles = {};

profiles.options = (data,callback)=>{
	// console.log(data.headers);

	callback(200,data.headers);
	
}

profiles.post = (data,callback)=>{

//check header here for token, the uuid and token must match what we have in the database and must not have expired
	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid;

	let nationality_origin = typeof(data.payload.nationality_origin) == 'string' && data.payload.nationality_origin.trim().length >= 3 ? data.payload.nationality_origin.trim() : false;
	let nationality_residence = typeof(data.payload.nationality_residence) == 'string' && data.payload.nationality_residence.trim().length >= 3 ? data.payload.nationality_residence.trim() : false;
	let state = typeof(data.payload.state) == 'string' && data.payload.state.trim().length >= 2 ? data.payload.state.trim() : false;
	let lga = typeof(data.payload.lga) == 'string' && data.payload.lga.trim().length >= 2 ? data.payload.lga.trim() : false;
	let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	let photo = typeof(data.payload.photo) == 'string' && data.payload.photo.trim().length > 0 ? data.payload.photo.trim() : false;
	let uuid = typeof(uuidHeader) == 'string' && uuidHeader.trim().length > 0 ? uuidHeader.trim() : false;
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;


	if(token && uuid){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + uuid + "'";

		con.query(verifyToken, (err,result)=>{

			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){

				if(
					nationality_origin &&
					nationality_residence &&
					state &&
					lga &&
					firstName &&
					lastName && 
					photo 

					){

					const checkUser = "SELECT * FROM users WHERE uuid='" + uuid + "'";
					

						con.query(checkUser,  (err,result) => {

							//check if profule already exist
							
							if(!err && result.length > 0){

								let checkProfile = "SELECT * FROM profiles WHERE uuid='" + uuid + "'";

								con.query(checkProfile, (err,result)=>{
									if(!err && 
										result.length < 1
										){
										//upload to cloudinary

										let sql = "INSERT INTO profiles (uuid, nationality_residence, nationality_origin, state, lga, firstName, lastName, photo) VALUES ( '" + uuid + "','" +nationality_residence+ "', '" +nationality_origin+ "','" + state + "' , '" + lga +"' ,'"+firstName +"', '" + lastName + "','" + photo +"' )";

										con.query(sql,  (err,result) => {

										   	if(!err){

										   		uploader.send({
													'file':photo,
													'table':'profiles',
													'uuid':uuid,
													'column':'photo'
													});

										   		callback(200, {'Success':'Profile created'});

										   	}else{
										   		console.log(err);
										   		callback(400, {'Error':'Profile Not created'});
										   		// callback(500, {'Error':'Table creation failed, its possible this table already exists'});
										   	}

								 		});

									}else{
										callback(403,{'Error':'User profile already exists, you should be updating'});
									}
								});

								
							}else{
								callback(404,{'Error':'User not found'});
							}

						});

						

					}else{
						let errorObject = [];
						if(!nationality_residence){
							errorObject.push('Nationality Residence is missing or invalid format');
						}
						if(!nationality_origin){
							errorObject.push('Nationality Origin is missing or invalid format');
						}
						if(!state){
							errorObject.push('State is missing or invalid format');
						}
						if(!lga){
							errorObject.push('lga is missing or invalide format');
						}
						if(!firstName){
							errorObject.push('firstName is missing or invalide format');
						}
						if(!lastName){
							errorObject.push('lastName is mising or invalide format');
						}
						if(!photo){
							errorObject.push('Photo is missing or invalid format');
						}

						callback(400,{'Error':errorObject});
					}

			}else{
				callback(400,{'Error':'Token Mismatch or expired'});
			}

		});	

	}else{
		callback(400,{'Error':'Token Invalid or expired'});
	}

	

	// callback(200,{'Success':'You have hit profile post endpoint'});
}


profiles.get = (data,callback)=>{
//get a user profile
	// let uuidQuery = typeof(data.queryStringObject.uuid) == 'string' && data.queryStringObject.uuid.trim().length > 0 ? data.queryStringObject.uuid.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;
	let uuidQuery = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;

	if(data && 
		token && 
		uuidHeader &&
		uuidQuery
		){

		let headerChecker = "SELECT * FROM tokens WHERE uuid='" + uuidHeader + "'";
		
		con.query(headerChecker,(err,results)=>{

			if(!err && 
				results && 
				results[0].token.length > 0){

				let profile = "SELECT profiles.* FROM profiles WHERE profiles.uuid='" + uuidQuery + "'";
			// console.log('uuid ' + uuidHeader);
				con.query(profile,(err,result)=>{
					
					if(!err && result[0]){
						callback(200,{'profile':result});
					}else{
						callback(404,{'Error':'User profile not found'});
					}

				})

			}else{
				callback(404,{'Error':'Token Invalid or Expired'});
			}

		});

	}else{
		let errorObject = [];
		if(!token){
			errorObject.push('Token Header is required');
		}
		if(!uuidHeader){
			errorObjet.push('UUID header is required');
		}
		if(!uuidQuery){
			errorObject.push('Query uuid is required');
		}
		callback(400,{'Error':errorObject});
	}

	// callback(200,{'Success':'You have hit profile get endpoint'});
}

profiles.put = (data,callback)=>{
	
	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid;
	let uuid = typeof(uuidHeader) == 'string' && uuidHeader.trim().length > 0 ? uuidHeader.trim() : false;
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;

	if(token && uuid){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + uuid + "'";

		con.query(verifyToken, (err,result)=>{

			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){

				
					const checkUser = "SELECT * FROM users WHERE uuid='" + uuid + "'";
					

						con.query(checkUser,  (err,result) => {

							//check if profule already exist
							console.log(' result ' + result);

							if(!err && result.length > 0){

								let checkProfile = "SELECT * FROM profiles WHERE uuid='" + uuid + "'";

								con.query(checkProfile, (err,result)=>{
									// console.log(result);
									if(!err && 
										result.length > 0
										){
										let nationality_residence = typeof(data.payload.nationality_residence) == 'string' && data.payload.nationality_residence.trim().length >= 3 ? data.payload.nationality_residence.trim() : result[0].nationality_residence;
										let nationality_origin = typeof(data.payload.nationality_origin) == 'string' && data.payload.nationality_origin.trim().length >= 3 ? data.payload.nationality_origin.trim() : result[0].nationality_origin;
										let state = typeof(data.payload.state) == 'string' && data.payload.state.trim().length >= 2 ? data.payload.state.trim() : result[0].state;
										let lga = typeof(data.payload.lga) == 'string' && data.payload.lga.trim().length >= 2 ? data.payload.lga.trim() : result[0].lga;
										let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : result[0].firstName;
										let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : result[0].lastName;
										let photo = typeof(data.payload.photo) == 'string' && data.payload.photo.trim().length > 0 ? data.payload.photo.trim() : result[0].photo;


										let updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
									

										let sql = "UPDATE profiles SET nationality_residence='" + nationality_residence + "', nationality_origin='" + nationality_origin + "', state ='"+state+"', lga ='"+lga+"', firstName='"+firstName+"', lastName='"+lastName+"',photo='"+ photo +"', updated_at='"+updated_at.toString()+"' WHERE uuid='" +uuid+ "'"; 

										con.query(sql,  (err,result) => {

										   	if(!err){
										   		console.log(result);
										   		callback(200, {'Success':'Profile Update Done'});

										   	}else{
										   		console.log(err);
										   		callback(400, {'Error':'Profile Update Failed'});
										   		// callback(500, {'Error':'Table creation failed, its possible this table already exists'});
										   	}

								 		});

									}else{
										callback(404,{'Error':'User profile not found, please create a profile'});
									}
								});

								
							}else{
								callback(404,{'Error':'User not found'});
							}

						});

						


			}else{
				callback(400,{'Error':'Token Mismatch or expired'});
			}

		});	

	}else{
		callback(400,{'Error':'Token Invalid or expired'});
	}

}

module.exports = profiles;
