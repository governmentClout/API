
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
  database: config.db_name

});


resets = {};

resets.options = (data,callback)=>{

	callback(200,data.headers);
	
}

resets.post = (data,callback)=>{
	
	//get reset email
	//collect user email, check if user email exists, 
	//generate password reset code, 
	//send password reset code to user

	let email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;

	if(email){

		//check that this email exists in the database

		let checkEmail = "SELECT * FROM users WHERE email='"+email+"'";

		con.query(checkEmail,(err,result)=>{

			if(!err && result.length > 0){

				//generate password reset code
				let resetCode = tokens.resetCode(email);
				let uuid = uuidV1();

					//enter the code in the database
					let resetSQL = "INSERT INTO password_reset (uuid,email,code,status) VALUES('"+uuid+"','"+email+"','"+resetCode+"','0')";

					con.query(resetSQL,(err,result)=>{

						if(!err){

							mailer.sendByEmail([
							'email':email,
		   					'subject':'Password Reset Code',
		   					'message':'Your password reset code is ' + resetCode
							]);

						}else{
							console.log(err);
							callback(500,{'Error','Something went wrong, reset code not sent'});
						}

					});

				callback(200,{'Success':'Password reset code has been sent'});

			}else{
				callback(404,{'Error':'Email not found'});
			}
		})

	}else{
		callback(400,{'Error':'Email is a required field'});
	}



}


resets.put = (data,callback)=>{
	


}

resets.get = (data,callback)=>{




}


module.exports = resets;
