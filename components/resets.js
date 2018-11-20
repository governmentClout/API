
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');
const tokens = require('./../lib/tokenization');
const mailer = require('./mailer');



const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name,
   multipleStatements: true

});


resets = {};

resets.options = (data,callback)=>{

	callback(200,data.headers);
	
}

resets.post = (data,callback)=>{

	let email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
	let param = typeof(data.param) == 'string' && data.param.trim().length > 0 && data.param.trim() == 'code' ? data.param : false;
	let reset_code = typeof(data.payload.reset_code) == 'string' && data.payload.reset_code.trim().length > 0 ? data.payload.reset_code.trim() : false;
// console.log(data);
	if(email && !param && !reset_code){

		//check that this email exists in the database

		let checkEmail = "SELECT * FROM users WHERE email='"+email+"'";

		con.query(checkEmail,(err,result)=>{

			if(!err && result.length > 0){

				//generate password reset code
				let resetCode = tokens.resetCode(email);
				let uuid = uuidV1();

					//enter the code in the database
					let resetSQL = "INSERT INTO password_reset (uuid,email,code) VALUES('"+uuid+"','"+email+"','"+resetCode+"')";

					con.query(resetSQL,(err,result)=>{

						if(!err){

							mailer.sendByEmail({
							'email' : email,
		   					'subject':'Password Reset Code',
		   					'message':'Your password reset code is ' + resetCode
							});

							callback(200,{'Success':'Password reset code has been sent'});

						}else{
							console.log(err);
							callback(500,{'Error':'Something went wrong, reset code not sent'});
						}

					});

				// callback(200,{'Success':'Password reset code has been sent'});

			}else{
				callback(404,{'Error':'Email not found'});
			}
		})

	}

	if(param){

		if(reset_code){

			let checkResetCode = "SELECT * FROM password_reset WHERE code='"+reset_code+"' AND status ='0'";

			con.query(checkResetCode,(err,result)=>{

				if(!err && result.length > 0){
					//code exists

					let userEmail = "SELECT * FROM users WHERE email='" +result[0].email+"'";

					con.query(userEmail,(err,result)=>{

						if(!err){

							callback(200,{'uuid':result[0].uuid});
						}else{
							callback(500,{'Error':err});
						}

					});

				}else{
					callback(404,{'Error':'Code does not exist or already used'});
				}

			});

		}else{
			callback(400,{'Error':'Reset code is required'});
		}

	}

	if(!email && !param){
		callback(400,{'Error':'You are trying the impossible, visit the right endpoint or send an email parameter'})
	}



}


resets.put = (data,callback)=>{
	//collect uuid, collect password

	let uuid = typeof(data.payload.uuid) == 'string' && data.payload.uuid.trim().length > 10 ? data.payload.uuid.trim() : false;
	let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	let reset_code = typeof(data.payload.reset_code) == 'string' && data.payload.reset_code.trim().length == 5 ? data.payload.reset_code.trim() : false;


	if(uuid && password && reset_code){

		let checkUUID = "SELECT * FROM users WHERE uuid='" +uuid+"'; SELECT * FROM password_reset WHERE code='"+reset_code+"' AND status='0'";

		con.query(checkUUID,(err,result)=>{
			
			if(!err && result[0].length > 0 && result[1].length > 0){

				
				let hashedPassword = helpers.hash(password);

				let updatePassword = "UPDATE users SET password='"+hashedPassword+"' WHERE uuid='"+uuid+"'; UPDATE password_reset set status='1' WHERE 	code='"+reset_code+"'; SELECT email from users WHERE uuid='"+uuid+"'";

				con.query(updatePassword,(err,result2)=>{
				
					if(!err && result2){
						let email = result2[2][0].email;
						mailer.sendByEmail({
							'email':email,
		   					'subject':'Password Reset Done',
		   					'message':'You just did a password reset on your account, if you did not initiate it... blah blah bleh'
							});

						callback(200,{'Success':'Password reset Done'})

					}else{
						callback(500,{'Error':'Password Reset Failed'});
					}

				});

			}else{

				callback(400,{'Error':'UUID or password reset request not found'});

			}
		});

	}else{
		let errorObject = [];
		if(!uuid){
			errorObject.push('uuid is a required field');
		}
		if(!reset_code){
			errorObject.push('reset_code is a required field');
		}
		if(!password){
			errorObject.push('password is required');
		}
		callback(400,errorObject);
	}

	




}


module.exports = resets;
