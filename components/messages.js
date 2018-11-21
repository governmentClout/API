

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

							friends = true;

						}

						let sendMessageSQL = "INSERT INTO messages (uuid,sender,receiver,message,reply_to) VALUES ('"+uuid+"','"+sender+"','"+receiver+"','"+message+"','"+reply_to+"')";

						con.query(sendMessageSQL,(err,result)=>{

							if(!err && result[0]){
								
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
	let user = typeof(data.queryStringObject) == 'string' && data.queryStringObject.trim().length > 0 ? data.queryStringObject.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false; 

	if(uuidHeader && token){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + uuidHeader + "'";

		con.query(verifyToken, (err,result)=>{
			
			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){

				if(param){
				//get message object for a single message, hence return the message and replies and profile of sender
					async.waterfall([
					    function(callback) {
					    	let sql = "SELECT * FROM messages WHERE uuid='"+param+"' WHERE reply_to = NULL";
					    	con.query(sql,(err,result)=>{
					    		
									callback(null,result);

								});
					    	
					    
					    },
					    function(arg, callback) {
					    	
					    	let result = [];
					    	var pending = arg.length;

					    	for(let i=0; i<arg.length; i++) {
					    		
					    	 con.query("SELECT * FROM messages WHERE uuid='"+arg[i].uuid+"' WHERE reply_to != NULL",(err, compile)=>{
					    	 		
					    	 		let post = arg[i];
					    	 		
						            finalresult.splice(i,0,{'message':post,'replies':compile});
						            

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
					//get message object of a user , includes the profile of the user and sender
					async.waterfall([
					    function(callback) {
					    	let sql = "SELECT * FROM messages WHERE reply_to = NULL";
					    	con.query(sql,(err,result)=>{
					    		
									callback(null,result);

								});
					    	
					    
					    },
					    function(arg, callback) {
					    	
					    	let result = [];
					    	var pending = arg.length;

					    	for(let i=0; i<arg.length; i++) {
					    		
					    	 con.query("SELECT * FROM messages WHERE uuid='"+arg[i].uuid+"' WHERE reply_to != NULL",(err, compile)=>{
					    	 		
					    	 		let post = arg[i];
					    	 		
						            finalresult.splice(i,0,{'message':post,'replies':compile});
						            

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
	//
}

messages.put = (data,callback)=>{
	//when a message is read, status is changed to read
}





module.exports = messages;
