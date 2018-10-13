/*
User Controller: All user based activities
*/

const _db = require('../lib/db');
const helpers = require('../lib/helpers');


let handlers = {};


handlers.notFound = (data,callback)=>{
	callback(404);
}


handlers.action = (data,callback)=>{
	
	let acceptableMethods = ['post','get','put','delete'];

	if(acceptableMethods.indexOf(data.method) > -1){

		handlers._users[data.method](data,callback);

	}else{

		callback(405);

	}
}


handlers._users = {};


handlers._users.post = (data,callback)=>{

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

		/*TODO  */
	
		callback(200);

	}else{
		
		callback(400,{'Error':'Missing required data'});
	}
};

module.exports = handlers;
