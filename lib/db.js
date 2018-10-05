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

  if (err) throw err;

  con.query("CREATE DATABASE gclout_db",  (err, result) => {

    if (!err && result) {
    	console.log("Database created");
    }else{
    	console.log(err);
    }
    
  });

});

let db = {}

db.createTable = (table,columns,callback)=>{
	//where tables are created if they don't already exist
	//check types

	let table = typeof(table) == 'string' && table.trim().length > 0 ? table : false;
	let columns = typeof(columns) == 'object' && columns != null ? columns : false;

	if(table && columns){

		con.connect( (err) => {

			 if (!err){

			 	//datanase cpmmected

			 	let sql = "";

			 	//wrte cpde tp [re[are sq; statement from  the given objects
			 	 con.query(sql,  (err, result) => {

				   	if(!err){

				   		callback(200, {'Success':'Table'});

				   	}else{

				   		callback(500, {'Error':'Table creation failed, its possible this table already exists});
				   	}

				  });

			  } else{

			  	callback(500, {'Error':'Database connection failed during table creation'});
			  
			  }

		});

	}else{
		callback(400, {'Error':'Missing Required Fields'});
	}

// });

}

db.select = (err,query,callback)=>{
//DO ALL VALIDATION
	con.connect( (err)=>{

		if(!err){
			//do actual select
		}else{
			callback(500, {'Error':'Database Connection Failed'});
		}

	});

}


module.exports = db;