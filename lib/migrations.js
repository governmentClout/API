// connect to mysql database here

const mysql = require('mysql');
const config = require('./config.js');
const dbconnect = require('./db_connect');


//test that mysql is connection
module.exports = dbconnect.connect( (err) => {

	dbconnect.database = config.db_name;

	const con = dbconnect;



	  if (!err) {
	  	
		con.query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = " + config.db_name,  (err, result) => {

			if (!err) {

				
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
						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".users ( id INT(11) NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , email VARCHAR(255) NULL DEFAULT NULL , password VARCHAR(255) NULL DEFAULT NULL , phone VARCHAR(255) NULL DEFAULT NULL , dob VARCHAR(255) NULL DEFAULT NULL , tosAgreement BOOLEAN NULL DEFAULT NULL , provider VARCHAR(255) NULL DEFAULT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT(1) NOT NULL DEFAULT '1' , PRIMARY KEY (id), UNIQUE (uuid, phone, email)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS "  + config.db_name + ".profiles ( id INT(11) NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , nationality VARCHAR(255) NOT NULL , state VARCHAR(255) NOT NULL , lga VARCHAR(255) NOT NULL , firstName VARCHAR(255) NOT NULL , lastName VARCHAR(255) NOT NULL , photo VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".tokens ( id INT(11) NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NULL DEFAULT NULL , token VARCHAR(255) NULL DEFAULT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT(1) NULL DEFAULT NULL , PRIMARY KEY (id)) ENGINE = InnoDB;",
				
						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".posts ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL, user VARCHAR(255) NOT NULL , post TEXT NOT NULL ,  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT(1) NULL DEFAULT NULL , location VARCHAR(255) NULL DEFAULT NULL, attachment VARCHAR(255) NULL DEFAULT NULL, post_type VARCHAR(255) NULL DEFAULT 'post', PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS "+config.db_name + ".comments ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , comment TEXT NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT NULL DEFAULT '1' , ref VARCHAR(255) NOT NULL , user VARCHAR(255) NOT NULL , PRIMARY KEY (id), UNIQUE (uuid)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".reactions ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , post VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT NOT NULL DEFAULT '1' , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".shares ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , post VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT NOT NULL DEFAULT '1' , PRIMARY KEY (id)) ENGINE = InnoDB;",
						
						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".views ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , post VARCHAR(255) NOT NULL, post VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT NOT NULL DEFAULT '1' , PRIMARY KEY (id)) ENGINE = InnoDB;"

					];

				for(let i = 0; i < queries.length ; i++){

						con.query(queries[i],(err,result)=>{

							if(!err){

									console.log('Database Table Migration ' + i + ' Done');

							}else{
								
								console.log(err);
							}
						});

				}

}
