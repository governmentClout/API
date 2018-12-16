

const _db = require('./../lib/migrations');
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');
const tokens = require('./../lib/tokenization');

const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name

});


let petitons = {};


petitons.options = (data,callback)=>{

	callback(200,data.headers);
	
}

petitons.post = (data,callback)=>{

	//create polls
	//respond to polls
	let tokenHeader = data.headers.token;
	let uuidHeader = data.headers.uuid; 
	let user = typeof(uuidHeader) == 'string' && uuidHeader.trim().length > 0 ? uuidHeader.trim() : false;
	let token = typeof(tokenHeader) == 'string' && tokenHeader.trim().length > 0 ? tokenHeader.trim() : false;
	let targeted_office = typeof(data.payload.targeted_office) == 'string' && data.payload.targeted_office.trim().length > 0 ? data.payload.targeted_office.trim() : false;
	let petition_class = typeof(data.payload.petition_class) == 'string' && data.payload.petition_class.trim().length > 0 ? data.payload.petition_class.trim() : false;
	let petition_title = typeof(data.payload.petition_title) == 'string' && data.payload.petition_title.trim().length > 0 ? data.payload.petition_title.trim() : false;
	let status = typeof(data.payload.status) == 'string' && data.payload.status.trim().length > 0 ? data.payload.status.trim() : '1';
	let petition = typeof(data.payload.petition) == 'string' && data.payload.petition.trim().length > 0 ? data.payload.petition.trim() : false;
	let attachment = typeof(data.payload.attachment) == 'object' && data.payload.attachment.length > 0  ? data.payload.attachment : null;

	let uuid = uuidV1();


	if( 
		token && 
		uuidHeader 

		){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

		con.query(verifyToken, (err,result)=>{
				
			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){

				if( targeted_office && 
					petition_class &&
					petition &&
					petition_title
					){

					//create new poll
					//user is the uuid of the creator
					if(attachment){
							attachment = JSON.stringify(attachment);
						}

					let sqlCreatePetition = "INSERT INTO petitions (uuid,user,targeted_office,petition_class,petition_title,attachment,status) VALUES ('"+uuid+"','"+user+"','"+targeted_office+"','"+petition_class+"','"+petition_title+"','" + attachment + "','0')";

					con.query(sqlCreatePetition,(err,result)=>{

						if(!err && result){

							callback(200,{'Success':'Petition Created'});

						}else{
							console.log(err);
							callback(500,{'Error':err});
						}

					});

				}else{

					let errorObject = [];

					if(!targeted_office){
						errorObject.push('Targeted Office is a required field');
					}
					if(!petition_class){
						errorObject.push('Petition Class is required');
					}
					if(!petition){
						errorObject.push('Petition content is required');
					}
					if(!petition_title){
						errorObject.push('Petition Title is required');
					}


					console.log(errorObject);
					callback(400,{'Error':errorObject});

				}

				
			}else{
				console.log(err);
				callback(400,{'Error':'Token Mismatch or expired'});
			
			}
		});

	}else{

		let errorObject = [];

		if(!token){
			errorObject.push('Token you supplied is not valid or has expired');
		}
		if(!uuidHeader){
			errorObject.push('uuid in the header not found');
		}

		callback(400,{'Error':errorObject});

	}
	
}

petitions.get = (data,callback)=>{
	callback(200,{'Success':'You have hit the petition get endpoint'});
}

petitions.delete = (data,callback)=>{

	let petition = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;

	if( 
		token && 
		uuidHeader &&
		post 
		){

		let headerChecker = "SELECT * FROM tokens WHERE uuid='" + uuidHeader + "'";
		
		con.query(headerChecker,(err,results)=>{
			
			if(!err && 
				results && 
				results[0].token.length > 0 &&
				results[0].token == token

				){

				let postQuery = "SELECT * FROM petitions WHERE uuid='" + petition + "'";
			
				con.query(postQuery, (err,result)=>{

					if(!err && result[0]){

						let deletePost = "DELETE FROM petitions WHERE uuid='"+petition+"'";

						con.query(deletePost,(err,result)=>{

							
							callback(200,{'Success':'Petition deleted'});
								
							
						});

					}else{
						console.log(err);
						callback(404,{'Error':'Petition not found'});
					}

				})

			}else{
				console.log(err);
				callback(404,{'Error':'Token Invalid or Expired'});
			}

		});

	}else{

		let errorObject = [];

		if(!token){
			errorObject.push('Token you supplied is not valid or expired');
		}
		if(!uuidHeader){
			errorObject.push('uuid in the header not found');
		}
		if(!post){
			errorObject.push('Petition uuid not valid');
		}

		callback(400,{'Error':errorObject});
	}

}




module.exports = petitons;

