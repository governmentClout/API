
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const tokens = require('./../lib/tokenization');

const con = require('./../lib/db');


sendmessages = {};

sendmessages.options = (data,callback)=>{

	callback(200,data.headers);
	
}

sendmessages.post = (data,callback)=>{
    callback(200,{'Success':'You have hit post endpoint'});
    //send message 
}

sendmessages.get = (data,callback)=>{
    callback(200,{'Success':'You have hit get endpoint'});
    //get all sent messages by this user
}

sendmessages.delete = (data,callback)=>{
    callback(200,{'Success':'You have hit delete endpoint'});
    //delete message sent by this user
}


module.exports = sendmessage;
