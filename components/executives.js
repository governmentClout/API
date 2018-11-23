
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


executives = {};

executives.options = (data,callback)=>{

	callback(200,data.headers);
	
}

executives.get = (data,callback)=>{
	//get executives for a single pereson
	// -- this must be area based... obviously president is the same for everyone, 
	// -- state should be that of origin, (add state of origin to profile)
	//and other areas

	callback(200,{'success':'you have hit executives get endpoint'})

}

executives.post = (data,callback)=>{
	//request to become an executve
	let user = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
	let token = typeof(data.token.uuid) == 'string' && data.token.uuid.trim().length > 0 ? data.token.uuid.trim() : false;
	let party = typeof(data.payload.party) == 'string' && data.payload.party.trim().length > 0 ? data.payload.party.trim() : false;
	let about_you = typeof(data.payload.about_you) == 'string' && data.payload.about_you.trim().length > 0 ? data.payload.about_you.trim() : false;
	let about_party = typeof(data.payload.about_party) == 'string' && data.payload.about_party.trim().length > 0 ? data.payload.about_party.trim() : false;
	let office = typeof(data.payload.office) == 'string' && data.payload.office.trim().length > 0 ? data.payload.office.trim() : false;
	let uuid = uuidV1();

	if(user && token){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

		con.query(verifyToken, (err,result)=>{
			
			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){

				//check that this request does not already exist

				let sqlCheckRequest = "SELECT * FROM executives WHERE user='"+user+"'";

				con.query(sqlCheckRequest,(err,result)=>{


					if(!err && result.length < 0){

						if(!about_you){
							about_you = '';
						}
						if(!about_party){
							about_party = '';
						}

						let sqlCreateExecutiveRequest = "INSERT INTO executives (uuid,user,party,about_you,about_party,office) VALUES('"+uuid+"','"+user+"','"+party+"','"+about_you+"','"+about_party+"','"+office+"')";

						con.query(sqlCreateExecutiveRequest,(err,result)=>{

							if(!err){

								//send email
								mailer.sendByUUID({
						   					'uuid':receiver,
						   					'subject':'Upgrade Request Submitted',
						   					'message':'Your upgrade request to become an executive has been submitted'
						   					});

								callback(200,{'Success':'Upgrade Request Sent'});

							}else{
								console.log(err);
								callback(500,{'Error':'Request not submitted, something went wrong'});
							}

						});

					}else{

						let errorObject = [];

						if(err){

							errorObject.push(err);

						}

						if(result.status = 0){
							errorObject.push('Request already pending');
						}

						if(result.status = 1){
							errorObject.push('User already an executive');
						}

						callback(400,{'Error':errorObject});
					}

				});

			}else{
					callback(405,{'Error':'Token invalid or mismatch'});
				}
	});

	}else{

		let errorObject = [];

		if(!user){
			errorObject.push('Missing header uuid');
		}
		if(!token){
			errorObject.push('Missing header token');
		}

		callback(400,{'Error':errorObject});
	}

	callback(200,{'success':'you have hit executives post endpoint'})

}

executives.delete = (data,callback)=>{
	//change executive profile
	//
	callback(200,{'success':'you have hit executives delete endpoint'})

}






module.exports = shares;
