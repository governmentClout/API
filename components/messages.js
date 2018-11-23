

const _db = require('./../lib/migrations');
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');
const mailer = require('./mailer');
const async = require('async'); 

const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name,
  multipleStatements: true

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
	let receiver = typeof(data.payload.receiver) == 'string' && data.payload.receiver.trim().length > 0 ? data.payload.receiver.trim(): false;
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

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + sender + "'";
			
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

							friends = true;
							//i can refuse them from sending message here
						}
					
						let sendMessageSQL = "INSERT INTO messages (uuid,sender,receiver,message,reply_to) VALUES ('"+uuid+"','"+sender+"','"+receiver+"','"+message+"','"+reply_to+"')";

						con.query(sendMessageSQL,(err,result)=>{
						
							if(!err){
									
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
	//get all message and replies
	//get details of specific message (messages and replies)

	let param = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	// let user = typeof(data.queryStringObject) == 'string' && data.queryStringObject.trim().length > 0 ? data.queryStringObject.trim() : false;
	let user = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false; 

	if(user && token){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

		con.query(verifyToken, (err,result)=>{
			
			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){

				if(param){
					let finalresult = [];
				//get message object for a single message, hence return the message and replies and profile of sender
					async.waterfall([
					    function(callback) {
					    	let sql = "SELECT * FROM messages WHERE uuid='"+param+"' AND reply_to ='"+null+"'";

					    	con.query(sql,(err,result)=>{

									callback(null,result);

								});
					    	
					    
					    },
					    function(arg, callback) {
					    	
					    	let result = [];
					    	var pending = arg.length;

					    	for(let i=0; i<arg.length; i++) {
					    		
					    	 con.query("SELECT * FROM messages WHERE reply_to='"+arg[i].uuid+"'",(err, compile)=>{
					    	 		
					    	 		let message = arg[i];
					    	 		
						            finalresult.splice(i,0,{'message':message,'replies':compile});
						            

						            if( 0 === --pending ) {

						               	callback(null, finalresult);

						            }

						        });
					    	}

					        
					    }
					], function (err, result) {
						
						callback(200,result);
					});
				}

				if(user){
					let finalresult = [];
					//get message object of a user , includes the profile of the user and sender
					async.waterfall([
					
					    function(callback) {
					
					    	let sql = "SELECT * FROM messages WHERE reply_to='" +null+"' AND receiver='"+user+"'; SELECT * FROM messages WHERE reply_to='"+null+"' AND sender='"+user+"'";

					    	con.query(sql,(err,result)=>{
					
									callback(null,result);


								});
					    	
					    
					    },
					    function(arg, callback) {
					    	
					    	let result = [];
					    	var pending = arg[1].length;
					    	let sent = arg[1];
					    	let received = arg[0];
					    	
					    	for(let i=0; i<received.length; i++) {
					    		
					    	 con.query("SELECT * FROM profiles WHERE uuid='"+received[i].sender+"'",(err, compile)=>{
					    	 		
						            finalresult.splice(i,0,{'message':received[i],'user':compile[0]});
						            

						            if( 0 === --received.length ) {
						            	
						               	callback(null, {'received':finalresult,'sent':sent});

						            }

						        });
					    	}

					        
					    }
					], function (err, result) {
					
						
						callback(200,result);
					});

				}

				if(!param && !user){
					callback(400,{'Error':'You are visiting a wrong endpoint or supplying wrong parameter'})
				}

			}else{
				callback(400,{'Error':'Token Mismatch or expired'});
			}
	});


	}else{
		let errorObject = [];

		if(!uuidHeader){
			errorObject.push('header uuid is invalid or missing');
		}
		if(!token){
			errorObject.push('Header token missing or invalid');
		}
		callback(400,{'Error':errorObject});
	}
}

messages.delete = (data,callback)=>{
	//delete message
	let param = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let user = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false; 

	if(param && user && token){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

		con.query(verifyToken, (err,result)=>{
			
			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){ 

				//check that this message exists and that the sender is the user
				let checkMessage = "SELECT * FROM messages WHERE uuid ='" +param+ "'";

				con.query(checkMessage,(err,result)=>{

					if(!err && result.length > 0){
					
						if(result[0].sender == user) {

							let updateMessage = "UPDATE messages set sender='"+null+"' WHERE uuid='"+result.uuid+"'";

							con.query(updateMessage,(err,result)=>{

								if(!err){

									callback(200,{'Success':'Message deleted'});

								}else{
									console.log(err);
									callback(500,{'Error':'Something went wrong'});
								}

							});

						}else if(result[0].receiver == user){

							let updateMessage = "UPDATE messages set receiver='"+null+"' WHERE uuid='"+result.uuid+"'";

							con.query(updateMessage,(err,result)=>{

								if(!err){

									callback(200,{'Success':'Message deleted'});

								}else{
									console.log(err);
									callback(500,{'Error':'Something went wrong'});
								}

							});

						}else{

							callback(400,{'Error':'You are not allowed to delete this message'})

						}

					}else{
						console.log(err);
						callback(400,{'Error':'Message not found'});
					}

				});

				
			}else{

			}
		});

	}else{
		let errorObject = [];
		if(!param){
			errorObject.push('UUID of message is required');
		}
		if(!user){
			errorObject.push('Header UUID is required');
		}
		if(!token){
			errorObject.push('Header Token is required');
		}
		callback(400,{'Error':errorObject});
	}


}

messages.put = (data,callback)=>{
	//when a message is read, status is changed to read
}





module.exports = messages;
