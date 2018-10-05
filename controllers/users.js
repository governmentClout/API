/*
User Controller: All user based activities
*/

const _db = require('../lib/db');
const helpers = require('../lib/helpers');
const routers = require('../lib/routers');

const users = {};


routers.users = (data,callback)=>{
	
	let acceptableMethods = ['post','get','put','delete'];

	if(acceptableMethods.indexOf(data.method) > -1){

		handlers._users[data.method](data,callback);

	}else{

		callback(405);

	}
}



routers._users.post = (data,callback)=>{

	let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
	let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	let dob = typeof(data.payload.dob) == 'string' && data.payload.dob.trim().length > 0 ? data.payload.dob.trim() : false;
	let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
	
	
	if(
		firstName && 
		lastName && 
		phone && 
		password && 
		dob &&
		tosAgreement){

		_db.read('users',phone,(err,data)=>{

			if(err){

				let hashedPassword = helpers.hash(password);

				if(hashedPassword){

						let userObject = {
							'firstName' : firstName,
							'lastName' : lastName,
							'phone' : phone,
							'hashedPassword' : hashedPassword,
							'tosAgreement' : true
						}

				_data.create('users',phone,userObject,(err)=>{

					if(!err){
						callback(200, {'Success':'User created'});
					}else{
						console.log(err);
						callback(500,{'Error':'Could not created user'})
					}

				});

				}else{
					callback(500, {'Error':'Password Hash Failed'});
				}

				

			}else{
				
				callback(400, {'Error':'User with that phone number already exists'})
			}
		})

	}else{
		console.log('firstname : ' + firstName + ' lastname ' + lastName + ' phone ' + phone + ' password ' + password + ' agreement ' + tosAgreement);
		callback(400,{'Error':'Missing required data'});
	}
};

