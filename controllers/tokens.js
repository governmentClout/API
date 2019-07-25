const models = require('./../models/index');
const randomString = require("randomstring");

const token = {}

token.verify = (uuid,token)=>{
    //verify that token is valid
    //collect user uuid, and token
    //check database for the details
    //return true if found
    //return false if not found
}

token.generate = (uuid)=>{

    uuid = typeof(uuid) == 'string' && uuid.trim().length > 10 ? uuid.trim() : false;

    let token = formToken(100,'alphanumeric');

	if(uuid && token){

        return models.Token.findOrCreate({where: {userId: uuid}, defaults: {userId: uuid,token:token}});
       

	}

}

let formToken = (len,char)=> randomString.generate({length: len,charset: char });

module.exports = token;