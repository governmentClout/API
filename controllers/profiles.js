
const config = require('./../lib/config');
const token = require('./../controllers/tokens');
const models = require('./../models/index');


let profiles = {};

profiles.options = (data,callback)=>{
	// console.log(data.headers);

	callback(200,data.headers);
	
}

profiles.post = (data,callback)=>{

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
				callback(400,{'Error':'Token Mismatch or expired'});
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
						userId: uuidParam,
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
										
						if(created){

							callback(200,{profile});
						}
						//TODO: Do update here, since profile already exists

						callback(400,{'Error':'User profile already exists, update instead'});

					}).catch((err)=>{

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

	let tokenHeader = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;
	let param = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;

	if( tokenHeader && 
		uuidHeader 	
		){

			token.verify(uuidHeader,tokenHeader).then((result)=>{
			
				if(!result){
					callback(400,{'Error':'Token Mismatch or expired'});
				}

			}).then(()=>{

				if(param){
					models.Profile.findOne({where: {userId:param},include:[{model:models.User},{model:models.State},{model:models.Lga},{model:models.Dsitrict},{model:models.FedRep}]}).then(profile=>callback(200,{profile}));
				}else {
					models.Profile.findOne({ where:{userId:uuidHeader},include:[{model:models.User},{model:models.State},{model:models.Lga},{model:models.Dsitrict},{model:models.FedRep}]}).then((profile)=>callback(200,{profile}));
				}
	
			}).catch((err)=>{
				//TODO: This should be optimzed
				console.log(err);
				callback(500,err);
			})	;				
		
	}else{
		let errorObject = [];
		if(!token){
			errorObject.push('Token Header is required');
		}
		if(!uuidHeader){
			errorObjet.push('UUID header is required');
		}
	
		callback(400,{'Error':errorObject});
	}

}

profiles.put = (data,callback)=>{

	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
	let tokenHeader = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;

	if(tokenHeader && uuidHeader){

		token.verify(uuidHeader,tokenHeader).then((result)=>{
			
			if(!result){
				callback(400,{'Error':'Token Mismatch or expired'});
			}

		}).then(()=>{

			models.Profile.findOne({where: {userId:uuidHeader}})
			.then((profile)=>{

				if(profile){

					let nationalityResidence = typeof(data.payload.nationalityResidence) == 'string' && data.payload.nationalityResidence.trim().length >= 3 ? data.payload.nationalityResidence.trim() : profile.nationalityResidence;
					let nationalityOrigin = typeof(data.payload.nationalityOrigin) == 'string' && data.payload.nationalityOrigin.trim().length >= 3 ? data.payload.nationalityOrigin.trim() : profile.nationalityOrigin;
					let state = typeof(data.payload.state) == 'string' && data.payload.state.trim().length >= 2 ? data.payload.state.trim() : profile.state;
					let lga = typeof(data.payload.lga) == 'string' && data.payload.lga.trim().length >= 2 ? data.payload.lga.trim() : profile.lga;
					let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : profile.firstName;
					let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : profile.lastName;
					let photo = typeof(data.payload.photo) == 'string' && data.payload.photo.trim().length > 0 ? data.payload.photo.trim() : profile.photo;
					let background = typeof(data.payload.background) == 'string' && data.payload.background.trim().length > 0 ? data.payload.background.trim() : profile.background;
					
					let dataObject = {						
						nationalityOrigin: nationalityOrigin,
						nationalityResidence:nationalityResidence,
						state:state,
						lga:lga,
						firstName:firstName,
						lastName:lastName,
						photo:photo,
						background:background
					};

					profile.update(dataObject)
					.then(() => {
						callback(200,{'Success':'Profile Update done'});
					})
					.catch(err=>callback(500,err));
					

				}else{
					callback(404,{'Error':'User Profile Does not exist, create profile instead'});
				}				

			});			
		

		}).catch((err)=>{
			//TODO: This should be optimzed
			console.log(err);
			callback(500,err);
		});		
	

	}else{
		callback(400,{'Error':'Token Invalid or expired'});
	}

}

module.exports = profiles;
