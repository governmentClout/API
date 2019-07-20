
const config = require('./../lib/config');
const con = require('./../lib/db');


states = {};

states.options = (data,callback)=>{

	callback(200,data.headers);
	
}

/**
 * @api {get} /states?sort=:sort&limi=:limit&page=:page get States 
 * @apiName getStates
 * @apiGroup States
 * @apiHeader {String} uuid Authorization UUID.
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint returns all states
 * @apiParam {String} page page you wish to get (pagination)
 * @apiParam {String} limit result count per page you wish to get (pagination)
 * @apiParam {String} sort result sort [ASC | DESC] (pagination)
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
{
    "states": [
        {
            "id": 1,
            "name": "Abia State"
        },
        {
            "id": 2,
            "name": "Adamawa State"
        },
        {
            "id": 3,
            "name": "Akwa Ibom State"
        },
        {
            "id": 4,
            "name": "Anambra State"
        }
        .
        .
        .
        .
        ]
}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 404 Bad Request
{
   
}

*/


states.get = (data,callback)=>{
      
        let user = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
	let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;

        let page = typeof(data.queryStringObject.page) == 'string'  ? data.queryStringObject.page : '1'; 
	let limit = typeof(data.queryStringObject.limit) == 'string' ? data.queryStringObject.limit : '10';
        let sort = typeof(data.queryStringObject.sort) == 'string' && data.queryStringObject.sort.trim().length > 0 && (data.queryStringObject.sort.trim() == 'ASC' || 'DESC') ? data.queryStringObject.sort.trim() : 'DESC';
        
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
                                        let sql = "SELECT * FROM states";

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

                                                                callback(200,{'states':result});

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


module.exports = states;
