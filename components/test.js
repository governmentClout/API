const async = require('async');

const config = require('./../lib/config');
const mysql = require('mysql'); 

const dbhelper = require('./../lib/db_helper');
const mailer = require('./mailer');



// function getStudents(ids, cb) { 
//     var students = [];
//     var pending = ids.length;
 
//     for(var i in ids) {
//         pool.query('SELECT * FROM students WHERE id = ?', [ ids[i] ], function(err, stu){
//             students.push(stu);
//             if( 0 === --pending ) {
//                 cb(students); //callback if all queries are processed
//             }
//         });
//     }
// }
 
// var ids = [1,2,3,4,5];
// getStudents(ids, function(students){
//     console.log(students);
// });


let con = mysql.createPool({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name,
  multipleStatements: true

});



const tests = {};

tests.get = (data,callback)=>{


mailer.send([]);

// 	console.log('getting started');
// 	async.waterfall([
// 	    (callback)=> {
// 	    	let sql = "SELECT * FROM posts";
// 	    	con.query(sql,(err,result)=>{
// 	    			console.log('query 1');
// 					callback(null,result);

// 				});
// 	    },
// 	    (post,callback)=>{
// 	    	//have all posts here
// 	    	//get user and profile for each post
// 	    	//put 
// console.log('query 2 start');
// 	    	let result = [];
// 	    	var pending = post.length;

// 	    	for(let i=0 ; i < post.length; i++) {
// 	    		// console.log(arg[i].uuid);
// 	    	 con.query("SELECT profiles.*,users.* FROM profiles LEFT JOIN users WHERE uuid='"+post[i].user+"'",(err, user)=>{
	    	 		
// 	    			console.log('query 2');

// 	    	 		con.query("SELECT * FROM comments WHERE ref='"+user[0].uuid+"';SELECT * from reactions WHERE post='"+user[0].uuid+"';SELECT * FROM shares WHERE post='"+user.uuid+"';SELECT * FROM views WHERE post='"+arg[i].uuid+"'",(err, compile)=>{
	    	 			
// 	    			console.log('query 3');

		    	 		
// 			            finalresult.splice(i,0,{'post':post[i],'user':user[0],'profile':user[1],'comments':compile[1],'reactions':compile[2],'shares':compile[3],'views':compile[4]});
			            

// 			            if( 0 === --pending ) {

// 			               	callback(null, finalresult);

// 			            }

// 			        });
	    	 		
		           
// 		        });
// 	    	}

// 	    },
	    
// 	], function (err, result) {
// 	    			console.log('query 4');
		
// 		callback(200,result);
// 	});
}

	





module.exports = tests;