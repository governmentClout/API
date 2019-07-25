
const config = require('./../lib/config');
const token = require('./../controllers/tokens');
const models = require('./../models/index');


let profiles = {};

profiles.options = (data,callback)=>{
	// console.log(data.headers);

	callback(200,data.headers);
	
}

profiles.post = (data,callback)=>{

//check header here for token, the uuid and token must match what we have in the database and must not have expired
	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid;

	let nationalityOrigin = typeof(data.payload.nationalityOrigin) == 'string' && data.payload.nationalityOrigin.trim().length >= 3 ? data.payload.nationalityOrigin.trim() : false;
	let nationalityResidence = typeof(data.payload.nationalityResidence) == 'string' && data.payload.nationalityResidence.trim().length >= 3 ? data.payload.nationalityResidence.trim() : false;
	let state = typeof(data.payload.state) == 'string' && data.payload.state.trim().length >= 2 ? data.payload.state.trim() : false;
	let lga = typeof(data.payload.lga) == 'string' && data.payload.lga.trim().length >= 2 ? data.payload.lga.trim() : false;
	let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	let photo = typeof(data.payload.photo) == 'string' && data.payload.photo.trim().length > 0 ? data.payload.photo.trim() : '';
	let background = typeof(data.payload.background) == 'string' && data.payload.background.trim().length > 0 ? data.payload.background.trim() : false;
	let uuidParam = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
	let tokenParam = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;

	if(tokenParam && uuidParam){
				
		token.verify(uuidParam,tokenParam).then((result)=>{
			
			if(!result){
				callback(400,{'Error':'Token Mismarstch or expired'});
			}else{
				return callback(400,{'Error':'Bad Request'});	
			}
		})
		.then(()=>{
		
			if(
				nationalityOrigin &&
				nationalityResidence &&
				state &&
				lga &&
				firstName &&
				lastName 

				){
		
					let data = {
						nationalityOrigin: nationalityOrigin,
						nationalityResidence:nationalityResidence,
						state:state,
						lga:lga,
						firstName:firstName,
						lastName:lastName,
						photo:photo,
						background:background
					};


					models.Profile.findOrCreate({where: {userId: uuidParam}, defaults: data})
					.then(([profile,created])=>{
						//data was created here, do something's and send out response
					
						if(created){

							callback(200,{profile});
						}
						callback(400,{'Error':'User profile already exists, update instread'});

					}).catch((err)=>{

						console.log("profile creation Error==>");
						console.log(err);
						callback(500,{'Error':err});
						
					});

				}else{

					let errorObject = [];
					if(!nationalityResidence){
						errorObject.push('Nationality Residence is missing or invalid format');
					}
					if(!nationalityOrigin){
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
				
					callback(400,{'Error':errorObject});
				}
			

		}).catch((err)=>{
			//TODO: This should be optimzed
			console.log(err);
			callback(500,err);
		});			

	}else{
		let errorObject = [];

		if(!tokenParam){
			errorObject.push('Token Header is required');
		}
		if(!uuidParam){
			errorObject.push('UUID header is required');
		}
		
		callback(400,{'Error':errorObject});
	}
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

				let profile = "SELECT * FROM profiles WHERE profiles.uuid='" + uuidQuery + "'";
			
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
										let background = typeof(data.payload.background) == 'string' && data.payload.background.trim().length > 0 ? data.payload.background.trim() : result[0].background;


										let updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
									

										let sql = "UPDATE profiles SET nationality_residence='" + nationality_residence + "', nationality_origin='" + nationality_origin + "', state ='"+state+"', lga ='"+lga+"', firstName='"+firstName+"', lastName='"+lastName+"',photo='"+ photo +"', background='"+background+"', updated_at='"+updated_at.toString()+"' WHERE uuid='" +uuid+ "'"; 

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
