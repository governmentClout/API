
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


views = {};

views.options = (data,callback)=>{

	callback(200,data.headers);
	
}

views.post = (data,callback)=>{

	let uuid = uuidV1();
	let user = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let post = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;

	if(user && token && post){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

		con.query(verifyToken, (err,result)=>{

			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){

				let viewSQL = "INSERT INTO views(uuid,user,post) VALUES ('"+uuid+"','"+user+"','"+post+"')";
				con.query(viewSQL,(err,result)=>{
					
					if(!err && result){
						callback(200,{'success':'view registered'});
					}else{
						console.log(err);
						callback(400,{'error':err});
					}
				});
			}else{
				console.log(err)
				callback(400,{'Error':'Token/UUID Mismatch or expired'});
			}

		});

	}else{
		let errorObject = [];
		if(!token){
			errorObject.push('Token is invalid');
		}

		if(!user){
			errorObject.push('User UUID invalid');
		}
		if(!post){
			errorObject.push('Post uuid invalid');		
		}
		callback(400,{'Error':errorObject});
	}

}

views.get = (data,callback)=>{

	let user = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let post = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;

	if(user && token && post){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

		con.query(verifyToken, (err,result)=>{

			if(
				!err && 
				result[0] && 
				result[0].token == token 
				){

				let sqlViewCount = "SELECT count(*) AS views FROM views WHERE post='" +post+ "'";
				con.query(sqlViewCount,(err,result)=>{

					if(!err && result){

						callback(200,result);

					}else{

						callback(400,{'Error':err});

					}

				});

			}else{
				console.log(err)
				callback(400,{'Error':'Token/UUID Mismatch or expired'});
			}

		});

	}else{
		let errorObject = [];
		if(!token){
			errorObject.push('Token is invalid');
		}

		if(!user){
			errorObject.push('User UUID invalid');
		}
		if(!post){
			errorObject.push('Post uuid invalid');		
		}
		callback(400,{'Error':errorObject});
	}
}


views.delete = (data,callback)=>{

	callback(200,{'success':'you have hit views delete endpoint'})

}






module.exports = views;
