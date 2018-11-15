let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

		con.query(verifyToken, (err,result)=>{
			
			if(
				!err && 
				result[0] && 
				result[0].token == token 

				){

			
				//can only view friends list
				//get friend list
				if(queryObject && queryObject.user != uuidHeader && param == 'friends'){

					let finalresult = [];

						async.waterfall([
						    function(callback) {

						    	let sqlGetFriends = "SELECT * FROM friends WHERE user='"+user+"' AND status=2";

						    	con.query(sql,(err,result)=>{
						    			
						    			if(!err && result.length > 0){
						    				callback(null,result);
						    			}else{
						    				callback(null,[]);
						    			}
										

									});
						    	
						    
						    },
						    function(arg, callback) {
						    	
						    	if(arg.length > 0){

						    		let result = [];
							    	var pending = arg.length;

							    	for(let i=0; i<arg.length; i++) {
							    		// console.log(arg[i].uuid);
							    	  con.query("SELECT * FROM profiles WHERE uuid='"+arg[i].uuid+"'",(err, result)=>{
							    	 		
							    	 		
								            finalresult.splice(i,0,result);
								            

								            if( 0 === --pending ) {

								               	callback(null,finalresult);

								            }

								        });
							    	}

						    	}else{
						    		callback(null, []);
						    	}
						    	

						        
						    }
						], function (err, result) {
							
							callback(200,{'friends':result});

						});

				}else{
					callback(403,{'Error':'Access Denied'});
				}
				

			if(!queryObject || queryObject.user == uuidHeader){
				//can do all things

				

			}

