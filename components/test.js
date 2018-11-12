const async = require('async');

const config = require('./../lib/config');
const mysql = require('mysql'); 

const dbhelper = require('./../lib/db_helper');

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

	let finalresult = [];

	async.waterfall([
	    function(callback) {
	    	let sql = "SELECT * FROM posts";
	    	con.query(sql,(err,result)=>{
	    		console.log('state 1');

	    		// finalResult[]
					callback(null,result);
				});
	    	
	     //    callback(null, 'one', 'two');
	    },
	    function(arg, callback) {
	    	console.log('state 2');
	    	let result = [];
	    	var pending = arg.length;

	    	for(let i=0; i<arg.length; i++) {
	    		// console.log(arg[i].uuid);
	    	 con.query("SELECT * FROM comments WHERE ref='"+arg[i].uuid+"';SELECT * from reactions WHERE post='"+arg[i].uuid+"';SELECT * FROM shares WHERE post='"+arg[i].uuid+"';SELECT * FROM views WHERE post='"+arg[i].uuid+"'",(err, compile)=>{

	    	 		// console.log(compile);
	    	 		
	    	 		let post = arg[i];
	    	 		// console.log(post);

		            finalresult.splice(i,0,[post,compile]);

		            // console.log('finalresult  ==> ');
		            // console.log(i);
		           	// console.log(finalresult);

		            if( 0 === --pending ) {

		            	// console.log('aftercomment===>');
		            	// console.log(comments);
		               	callback(null, finalresult);
		            }

		        });
	    	}

	        
	    },
	    function(complete, callback) {
	        // arg1 now equals 'three'

	        console.log('state 3');
	        // console.log(comments);
	        callback(null, complete);
	    }
	], function (err, result) {
		
		callback(200,result);
	});

	// async.waterfall([
	// 	(callback)=>{
	// 		let sql = "SELECT * FROM posts";
	// 		con.query(sql,(err,result)=>{
	// 			callback(result);
	// 		});
	// 	},
	// 	(data,callback)=>{
	// 		let sql2 = "SELECT * FROM comments WHERE post='"+result.uuid+"'";
	// 		con.query(sql2,(err,result2)=>{
	// 			callback(result2);
	// 		});
	// 	},
	// 	(data,callback)=>{
	// 		let sql3 = "SELECT * FROM users WHERE uuid='"+data.user+"'";
	// 		con.query(sql3,(err,result3)=>{
	// 			callback(result3)
	// 		});
	// 	}
	    
	// ], function (err, result) {
	//     callback(200,result);
	// });

}



module.exports = tests;