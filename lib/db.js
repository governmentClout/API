// connect to mysql database here

const mysql = require('mysql');
const config = require('./config.js');
const dbconnect = require('./db_connect');


//test that mysql is connection
dbconnect.connect( (err) => {

	dbconnect.database = config.db_name;

	const con = dbconnect;



	  if (!err) {
	  	
		con.query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = " + config.db_name,  (err, result) => {

			if (!err) {

				console.log('point 3');
				//If connection is 
			  	//table queries here, be sure that those tables don't already exists, so we don't get error thrown.
			  	/*
					Table List:
					1. Users
					2. Profiles
					3. Tokens
			  	*/

				migrations(con);


			}else{
			
				con.query("CREATE DATABASE IF NOT EXISTS " + config.db_name ,  (err,result) => {

					if (!err) {
						
						migrations(con);

					}else{
						
						console.log(err);
					}

				});
			}

		});

  }else{
  	
  		console.log("Connection was not established",err);
  }

});


const migrations = (con)=>{

	let queries = [
						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".users ( id INT(11) NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , email VARCHAR(255) NOT NULL , password VARCHAR(255) NOT NULL , phone VARCHAR(255) NOT NULL , dob VARCHAR(255) NOT NULL , tosAgreement BOOLEAN NULL DEFAULT NULL , provider VARCHAR(255) NULL DEFAULT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT(1) NOT NULL DEFAULT '1' , PRIMARY KEY (id), UNIQUE (uuid, phone, email)) ENGINE = InnoDB;",
						"CREATE TABLE IF NOT EXISTS "  + config.db_name + ".profiles ( id INT(11) NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , nationality VARCHAR(255) NOT NULL , state VARCHAR(255) NOT NULL , lga VARCHAR(255) NOT NULL , firstName VARCHAR(255) NOT NULL , lastName VARCHAR(255) NOT NULL , photo VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (id)) ENGINE = InnoDB;",
						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".tokens ( id INT(11) NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NULL DEFAULT NULL , token VARCHAR(255) NULL DEFAULT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT(1) NULL DEFAULT NULL , PRIMARY KEY (id)) ENGINE = InnoDB;",
						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".media ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NULL DEFAULT NULL , url VARCHAR(255) NOT NULL , type VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT NOT NULL , location VARCHAR(255) NULL DEFAULT NULL , PRIMARY KEY (id)) ENGINE = InnoDB;",
						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".posts ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , post TEXT NOT NULL ,  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT NOT NULL , location VARCHAR(255) NULL DEFAULT NULL , PRIMARY KEY (id)) ENGINE = InnoDB;",
						
					];

				for(let i = 0; i < queries.length ; i++){

						con.query(queries[i],(err)=>{

							if(!err){
								
								console.log('Database Table Migration ' + i + ' Done');

							}else{
								
								console.log(err);
							}
						});

				}

}



/*
create all database 
*/



let db = {}

db.query = (statement) => {

	statement = typeof(statement) == 'string' && statement.trim().length > 0 ? statement : false;
	
	if(statement){

		dbconnect.connect( (err) => {

			 if (!err){

			 	 dbconnect.query(statement,  (err, result) => {

				   	if(!err){

				   		return true;

				   	}else{

				   		return false;
				   		// callback(500, {'Error':'Table creation failed, its possible this table already exists'});
				   	}

				  });

			  } else{

			  	console.log(500, {'Error ':'Database connection failed during query'});
			  
			  }

		});

	}else{
		console.log(400, {'Error':'Missing Required Fields'});
	}
	
}

db.exists = (table,column,name)=>{
	//to find out if something exists in the database, returns true or false
	let sql = "SELECT * FROM " + table + " WHERE " + column + " = " + name;
	let test = db.query(sql);

	if(test && 
		test != '' && 
		test != NULL
		){
		return true;
	}else{
		return false;
	}
}



module.exports = db;