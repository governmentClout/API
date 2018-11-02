
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


shares = {};

shares.options = (data,callback)=>{

	callback(200,data.headers);
	
}

shares.get = (data,callback)=>{

	let token = data.headers.token;
	let user = data.headers.uuid;
	let post = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
	let uuid = uuidV1();

	if( token && user ){

		let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

		con.query(verifyToken, (err,result)=>{
			
			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){

					if(post){
						//check if user already liked post

						let sql = "INSERT INTO shares (uuid,post) VALUES('"+uuid+"','" + post+"')";

						con.query(sql,(err,result)=>{

							if(!err && result){

								callback(200,{'Success':'Post Shared'});

							}else{
								console.log(err);
								callback(500,{'Error':'Operation Failed'});

							}

						});

					}else{
						let errorObject = [];

						if(!post){
							errorObject.push('missing post uuid')
						}

						callback(405,{'Error':errorObject});
					}


			}else{
				callback(400,{'Error':'Token Mismatch or expired'});
			}

		});
		
	}else{

			callback(400,{'Error':'Missing Header Parameters'});
	}	


}




module.exports = shares;
