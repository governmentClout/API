const models = require('./../models/index');
const randomString = require("randomstring");

const token = {}

token.verify = (uuid,token)=>{

    return models.Token.findOne({where: {userId: uuid,token:token}}) ;
    
}

token.generate = (uuid)=>{

    uuid = typeof(uuid) == 'string' && uuid.trim().length > 10 ? uuid.trim() : false;

   	let token = formToken(100,'alphanumeric');

	if(uuid && token){

        let data = {
            token:token,
            userId:uuid
        }

        return models.Token.findOrCreate({where: {userId: uuid}, defaults: data}) 
       

	}else{
		return false;
	}

}

token.reset = (uuid,oldToken)=>{
    //once there is a passowrd reset done, reset the token too
}

let formToken = (len,char)=> randomString.generate({length: len,charset: char });

module.exports = token;