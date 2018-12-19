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

						"CREATE TABLE IF NOT EXISTS "  + config.db_name + ".profiles ( id INT(11) NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , nationality_origin VARCHAR(255) NOT NULL, nationality_residence VARCHAR(255) NOT NULL , state VARCHAR(255) NOT NULL , lga VARCHAR(255) NOT NULL , firstName VARCHAR(255) NOT NULL , lastName VARCHAR(255) NOT NULL , photo VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".tokens ( id INT(11) NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NULL DEFAULT NULL , token VARCHAR(255) NULL DEFAULT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT(1) NULL DEFAULT NULL , PRIMARY KEY (id)) ENGINE = InnoDB;",
				
						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".posts ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL, user VARCHAR(255) NOT NULL , post TEXT NOT NULL ,  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT(1) NULL DEFAULT NULL , location VARCHAR(255) NULL DEFAULT NULL, attachment VARCHAR(255) NULL DEFAULT NULL, post_type VARCHAR(255) NULL DEFAULT 'post', PRIMARY KEY (id)) ENGINE = InnoDB;",
						
						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".articles ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL, user VARCHAR(255) NOT NULL , article TEXT NOT NULL , article_title TEXT NOT NULL ,  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT(1) NULL DEFAULT NULL , location VARCHAR(255) NULL DEFAULT NULL, attachment VARCHAR(255) NULL DEFAULT NULL, post_type VARCHAR(255) NULL DEFAULT 'post', PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS "+config.db_name + ".comments ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , comment TEXT NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT NULL DEFAULT '1' , ref VARCHAR(255) NOT NULL , user VARCHAR(255) NOT NULL , PRIMARY KEY (id), UNIQUE (uuid)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".reactions ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , post VARCHAR(255) NOT NULL ,user VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT NOT NULL DEFAULT '1' , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".shares ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , post VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT NOT NULL DEFAULT '1' , PRIMARY KEY (id)) ENGINE = InnoDB;",
						
						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".views ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , post VARCHAR(255) NOT NULL, user VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT NOT NULL DEFAULT '1' , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS " +config.db_name + ".friends ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL, friend VARCHAR(255) NOT NULL , user VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT(1) NOT NULL DEFAULT '0' , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".polls ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , sector VARCHAR(255) NOT NULL , opinion TEXT NOT NULL , created_by VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , expire_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP , status INT(1) NOT NULL DEFAULT 0 , response_limit INT(255) NULL , PRIMARY KEY (id)) ENGINE = InnoDB",

						"CREATE TABLE IF NOT EXISTS "+ config.db_name + ".polls_response ( id INT NOT NULL AUTO_INCREMENT , poll VARCHAR(255) NOT NULL , user VARCHAR(255) NOT NULL , status INT(1) NOT NULL DEFAULT '0', created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS "+config.db_name+" .password_reset (id INT NOT NULL AUTO_INCREMENT, uuid VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, code VARCHAR(255) NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, status INT(1) NOT NULL DEFAULT '0' , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS "+config.db_name+".messages (id INT NOT NULL AUTO_INCREMENT, uuid VARCHAR(255) NOT NULL, sender VARCHAR(255) NOT NULL, receiver VARCHAR(255) NOT NULL, message TEXT NOT NULL, reply_to VARCHAR(255) NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, status INT(1) NOT NULL DEFAULT '0' , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS " +config.db_name+".executives (id INT NOT NULL AUTO_INCREMENT, uuid VARCHAR(255) NOT NULL, user VARCHAR(255) NOT NULL, party VARCHAR(255) NOT NULL, admin VARCHAR(255) NOT NULL, about_you TEXT NOT NULL, about_party TEXT NOT NULL, office VARCHAR(255) NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, status INT(1) NOT NULL DEFAULT '0' , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS " +config.db_name+".petitions (id INT NOT NULL AUTO_INCREMENT, uuid VARCHAR(255) NOT NULL, user VARCHAR(255) NOT NULL, targeted_office VARCHAR(255) NOT NULL, petition_class VARCHAR(255) NOT NULL, petition_title TEXT NOT NULL, attachment VARCHAR(255) NULL DEFAULT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, status INT(1) NOT NULL DEFAULT '0' , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS " +config.db_name+ ".petitions_sign (id INT NOT NULL AUTO_INCREMENT, petition VARCHAR(255) NOT NULL, user VARCHAR(255) NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, status INT(1) NOT NULL DEFAULT '0' , PRIMARY KEY (id)) ENGINE = InnoDB;"

					];


					// "ALTER TABLE " +config.db_name+".profiles ADD background VARCHAR(255) NOT NULL AFTER photo;",


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
