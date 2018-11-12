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
	    		
					callback(null,result);
				});
	    	
	    
	    },
	    function(arg, callback) {
	    	
	    	let result = [];
	    	var pending = arg.length;

	    	for(let i=0; i<arg.length; i++) {
	    		// console.log(arg[i].uuid);
	    	 con.query("SELECT * FROM comments WHERE ref='"+arg[i].uuid+"';SELECT * from reactions WHERE post='"+arg[i].uuid+"';SELECT * FROM shares WHERE post='"+arg[i].uuid+"';SELECT * FROM views WHERE post='"+arg[i].uuid+"'",(err, compile)=>{
	    	 		
	    	 		let post = arg[i];
	    	 		
		            finalresult.splice(i,0,{'post':post,'comments':compile[0],'reactions':compile[1],'shares':compile[2],'views':compile[3]});
		            

		            if( 0 === --pending ) {

		               	callback(null, finalresult);

		            }

		        });
	    	}

	        
	    }
	], function (err, result) {
		
		callback(200,result);
	});

	

}



module.exports = tests;