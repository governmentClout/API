const models = require('./../models/index');
const randomString = require("randomstring");

const token = {}

token.verify = (uuid,token)=>{
    //verify that token is valid
    //collect user uuid, and token
    //check database for the details
    //return true if found
    //return false if not found

    return models.Token.findOne({where: {userId: uuid,token:token}}) ;
}

token.generate = (uuid)=>{
    //generate a new token
    //return the generated token
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

let formToken = (len,char)=> randomString.generate({length: len,charset: char });

module.exports = token;