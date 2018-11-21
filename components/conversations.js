

const _db = require('./../lib/migrations');
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');

const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name

});


let conversations = {};


conversations.options = (data,callback)=>{

	callback(200,data.headers);
	
}

conversations.post = (data,callback)=>{
	//send message
	//sender (uuid)
	//receiver (uuid)
	//message
	//reply_to (uuid)
	//uuid

	let sender = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let receiver = typeof(data.payload.receiver) == 'string' && data.payload.sender.trim().length > 0 ? data.payload.receiver.trim(): false;
	let message = typeof(data.payload.message) == 'string' && data.payload.message.trim().length > 0 ? data.payload.message.trim() : false;
	let reply_to = typeof(data.payload.reply_to) == 'string' && data.payload.reply_to.trim().length > 0 ? data.payload.reply_to.trim() : false;
	let uuid = uuidV1();


	if( 
		token && 
		sender &&
		receiver &&
		message 

		){

		if(!reply_to){
			reply_to = null;
		}

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";
			
			con.query(verifyToken, (err,result)=>{

				if(
				!err && 
				result[0] && 
				result[0].token == token 

				){
					
				}else{

					callback(400,{'Error':'Token Mismatch or expired'});
				}


			});
			


	}else{

		let errorObject = [];

		if(!token){
			errorObject.push('Token you supplied is not valid or has expired');
		}
		if(!sender){
			errorObject.push('sender is required');
		}
		if(!receiver){
			errorObject.push('receiver is required');
		}
		if(!message){
			errorObject.push('message is required');
		}
		
		callback(400,{'Error':errorObject});

	}


	
}

conversations.get = (data,callback)=>{
	//get all message
	//
}

conversations.delete = (data,callback)=>{
	//delete message
	//
}

conversations.put = (data,callback)=>{
	//when a message is read, status is changed to read
}





module.exports = conversations;
