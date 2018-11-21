

const _db = require('./../lib/migrations');
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');
const mailer = require('./mailer');

const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name

});


let messages = {};


messages.options = (data,callback)=>{

	callback(200,data.headers);
	
}

messages.post = (data,callback)=>{
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

					//anybody can send message to anybody, but check if they are friends, 
					//if they are not friends, send a notice to the frontend
					//if they are friends, send the message without notice

					let checkIfConnectionExists = "SELECT * FROM friends WHERE user='"+sender+"' AND friend='"+receiver+"'; SELECT * FROM friends WHERE user='"+receiver+"' AND friend='"+sender+"'";

					con.query(checkIfConnectionExists,(err,result)=>{

						let friends = false;

						if(!err && result[0].length > 0 && result[1].length > 0){

							//this means they are friends
							friends = true;
							

						}

						//send the message

						let sendMessageSQL = "INSERT INTO messages (uuid,sender,receiver,message,reply_to) VALUES ('"+uuid+"','"+sender+"','"+receiver+"','"+message+"','"+reply_to+"')";

						con.query(sendMessageSQL,(err,result)=>{

							if(!err && result[0]){
								//message sent, send email
										mailer.sendByUUID({
						   					'uuid':receiver,
						   					'subject':'New Message',
						   					'message':'You have a new message'
						   					});
										
								callback(200,{'Success':'Message sent'});

							}else{
								console.log(err);
								callback(500,{'Error':'Message not sent'});

							}

						});

					});


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

messages.get = (data,callback)=>{
	//get all message
	//
}

messages.delete = (data,callback)=>{
	//delete message
	//
}

messages.put = (data,callback)=>{
	//when a message is read, status is changed to read
}





module.exports = messages;
