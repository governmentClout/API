// connect to mysql database here

const mysql = require('mysql');
const config = require('./config.js');


const con = mysql.createConnection({
  host: config.db_host,
  user: config.db_username,
  password: config.db_password
});


//create database
con.connect( (err) => {

  if (!err) {
  	//add try catch here, so error is not thrown
  	 con.query("CREATE DATABASE IF NOT EXISTS " + config.db_name,  (err, result) => {

	    if (!err && result) {
	    	console.log("Database created");
	    }else{
	    	console.log(err);
	    }
	    
	  });

  }else{
  	console.log('Database creation faled, it probably already exists');
  }

 

});

let db = {}

db.query = (statement,callback) => {

	statement = typeof(statement) == 'string' && statement.trim().length > 0 ? statement : false;
	
	if(statement){

		con.connect( (err) => {

			 if (!err){

			 	 con.query(statement,  (err, result) => {

				   	if(!err){

				   		callback(200, {'Success':'Table Created'});

				   	}else{
				   		console.log(err);
				   		callback(500, {'Error':'Table creation failed, its possible this table already exists'});
				   	}

				  });

			  } else{

			  	callback(500, {'Error':'Database connection failed during table creation'});
			  
			  }

		});

	}else{
		callback(400, {'Error':'Missing Required Fields'});
	}



}


module.exports = db;