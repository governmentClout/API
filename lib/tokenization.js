const config = require('./config');
const randomString = require("randomstring");


const token = {};

token.generate = (uuid) => {
	//takes uuid of user, create a new token and inserts it into the database
	uuid = typeof(uuid) == 'string' && uuid.trim().length > 10 ? uuid.trim() : false;

	let token = randomString.generate(100);

	if(uuid && token){
		//connect to db
		return token; 

	}else{
		return false;
	}


}

token.resetCode = (email) => {
	email = typeof(email) == 'string' && email.trim().length > 0 ? email.trim() : false;

	let code = randomString.generate(5);

	if(code && email){
		return code;
	}else{
		return '';
	}
}

token.checkExpire = (uuid,token) => {
	//check if a token has expired



}

token.refresh = (uuid,token)=> {
	//update expired token
}

token.verify = (uuid,token)=>{
	//verify if a token is valid
}

module.exports = token;