
const config = require('./../lib/config');
const con = require('./../lib/db');


districts = {};

districts.options = (data,callback)=>{

	callback(200,data.headers);
	
}

//get all districts
//get all districts inside a state
//get all lgas inside a district

/**
 * @api {get} /districts/:id?sort=:sort&limi=:limit&page=:page get Single Party 
 * @apiName getSingleParty
 * @apiGroup LGA
 * @apiHeader {String} uuid Authorization UUID.
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint returns all states lga
 * @apiParam {String} id id of the party
 * @apiParam {String} page page you wish to get (pagination)
 * @apiParam {String} limit result count per page you wish to get (pagination)
 * @apiParam {String} sort result sort [ASC | DESC] (pagination)
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
{

}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 404 Bad Request
{
   
}

*/

/**
 * @api {get} /parties?sort=:sort&limi=:limit&page=:page get Parties 
 * @apiName getAllParties
 * @apiGroup Parties
 * @apiHeader {String} uuid Authorization UUID.
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint returns all states lga
 * @apiParam {String} page page you wish to get (pagination)
 * @apiParam {String} limit result count per page you wish to get (pagination)
 * @apiParam {String} sort result sort [ASC | DESC] (pagination)
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
{

}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 404 Bad Request
{
   
}

*/


parties.get = (data,callback)=>{

    let user = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;

    let page = typeof(data.queryStringObject.page) == 'string'  ? data.queryStringObject.page : '1'; 
	let limit = typeof(data.queryStringObject.limit) == 'string' ? data.queryStringObject.limit : '10';
    let sort = typeof(data.queryStringObject.sort) == 'string' && data.queryStringObject.sort.trim().length > 0 && (data.queryStringObject.sort.trim() == 'ASC' || 'DESC') ? data.queryStringObject.sort.trim() : 'DESC';
	let party = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
        
        if( 
		token && 
		user 

		){

            let verifyToken = "SELECT token FROM " + config.db_name + ".tokens WHERE uuid='" + user + "'";

			con.query(verifyToken, (err,result)=>{
				
				if(

                            !err && 
                            result[0] && 
                            result[0].token == token 

                            ){
                                    let sql = "SELECT * FROM parties";
                                    
                                    if(state){
                                        sql += " WHERE id = " + party;
                                    }
                                    if(sort){
                                            sql += " ORDER BY id " + sort;
                                    }

                                    if(limit){
                                            sql += " LIMIT " + limit;
                                    }

                                    if(page){
                                            
                                            let skip = page == '1' ? 0 : page * limit;
                                            sql += " OFFSET " + skip;

                                    }

                                    con.query(sql,(err,result)=>{
                                        
                                            if(!err && result.length > 0){

                                                    callback(200,{'parties':result});

                                            }else{
                                                    console.log(err);
                                                    callback(500,{'Error':err});
                                            }

                                    });

                            }else{
                                    console.log(err);
                                    callback(400,{'Error':'Token Mismatch or expired'});
                            }
                        });
                        

                }else{

		let errorObject = [];

		if(!token){
			errorObject.push('Token you supplied is not valid or has expired');
		}
		if(!user){
			errorObject.push('uuid in the header not found');
		}

		callback(400,{'Error':errorObject});

	}
}


module.exports = parties;
