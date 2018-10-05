// connect to mysql database here

const mysql = require('mysql');
const config = require('./config.js');


const db = mysql.createConnection({
  host: config.db_host,
  user: config.db_username,
  password: config.db_password
});

//test the connection
db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


db.select = (err,query)=>{

}


module.exports = db;