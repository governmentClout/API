
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');

const con = mysql.createConnection({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name,
  multipleStatements: true

});



let trends = {};

trends.options = (data,callback)=>{

	callback(200,data.headers);
	
}

//fetch both post and articles

trends.get = (data,callback)=>{
	//token validation

	let token = data.headers.token;
	let user = data.headers.uuid;

	let queryObject = Object.keys(data.queryStringObject).length > 0 && typeof(data.queryStringObject) == 'object' ? data.queryStringObject : false;
	let param = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;

	let page = typeof(data.queryStringObject.page) == 'string'  ? data.queryStringObject.page : '1'; 
	let limit = typeof(data.queryStringObject.limit) == 'string' ? data.queryStringObject.limit : '10';
	let sort = typeof(data.queryStringObject.sort) == 'string' && data.queryStringObject.sort.trim().length > 0 && (data.queryStringObject.sort.trim() == 'ASC' || 'DESC') ? data.queryStringObject.sort.trim() : 'DESC';
	let total_record = 0;

	//param: post types - poll, petition, post, articles, all

		if( token && user ){

			let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

			con.query(verifyToken, (err,result)=>{
				
				if(
					!err && 
					result[0] && 
					result[0].token == token 

					){

					if(param == 'all'){

						async.series([
						    function(callback){
						        //create a single table that contains posts, comments + shares + reactions as trend and order by trend.
							    	//get the number of results they want or return default of 2
						        callback(null, 'one');
						    },
						    function(callback){
						        //create a single table that contains articles, comments + shares + reactions as trend and order by trend.
							    	//get the number of results they want or return defailt of 2
						        callback(null, 'two');
						    },
						     function(callback){
						       //create a single table with petitions and count.reactions, order by count.reaction
						    	//get the number of results they want or just return default of 2
						        callback(null, 'three');
						    },
						     function(callback){
						       //create a single table with polls and count.reactions, order by count.reaction
						    	//get the number of results they want or just return default of 2
						        callback(null, 'four');
						    }
						],
						// optional callback
						function(err, results){
						    // results is now equal to ['one', 'two']
						});

					}

					



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


module.exports = trends;
