const helpers = require('./../lib/helpers');
const models = require('./../models/index');


let login = {};

login.options = (data,callback)=>{

	callback(200,data.headers);
	
}

login.post = (data,callback)=>{

	let email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length >= 10 ? data.payload.email.trim() : false;
	let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	let provider = typeof(data.payload.provider) == 'string' && data.payload.provider.trim().length > 0 ? data.payload.provider.trim() : false;
	
	if(provider && provider == 'email' && password && email){	
		
		let hashedPassword = helpers.hash(password);
		
		models.User
		.findAll({where: {email:email,password:hashedPassword}, include: [{model:models.Token},{model:models.Profile}]})
		.then((user) => {	
			
			if(user.length > 0){			
				callback(200,{user});							
			}
			callback(404,{'Error':'User Not Found'});
		})
		.catch(err=>{			
			console.log(err);
			callback(500,{'Errors':err});
		});		

	}else{

		let errorObject = [];

		if(!provider){
			errorObject.push('provider is a required field');
		}
		if(!email){
			errorObject.push('email is a required field');
		}
		if(!password){
			errorObject.push('password is a required field');
		}
		
		console.log(errorObject);
		callback(400,{'Error':errorObject});

	}
}

module.exports = login;