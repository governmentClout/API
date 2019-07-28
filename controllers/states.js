'use strict'

const models = require('./../models/index');
const token = require('./../controllers/tokens');

let states = {};

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
      
        let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
	let tokenHeader = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;

        let page = typeof(data.queryStringObject.page) == 'string'  ? data.queryStringObject.page : 1; 
	let limit = typeof(data.queryStringObject.limit) == 'string' ? data.queryStringObject.limit : 10;
        let sort = typeof(data.queryStringObject.sort) == 'string' && data.queryStringObject.sort.trim().length > 0 && (data.queryStringObject.sort.trim() == 'ASC' || 'DESC') ? data.queryStringObject.sort.trim() : 'DESC';
        
        if( 
		tokenHeader && 
		uuidHeader 

		){

                        token.verify(uuidHeader,tokenHeader).then((result)=>{
			
                                if(!result){
                                        callback(400,{'Error':'Token Mismatch or expired'});
                                }			
                        })
                        .then(()=>{

                                models.State
                                .findAndCountAll({ offset: page, limit: limit, order: [['name', sort]]})
                                .then((states)=>callback(200,{states}))

                        }).catch((err)=>{
                                //TODO: This should be optimzed
                                console.log(err);
                                callback(500,err);
                        })	;		
                 

                }else{

		let errorObject = [];

		if(!tokenHeader){
			errorObject.push('Token you supplied is not valid or has expired');
		}
		if(!uuidHeader){
			errorObject.push('uuid in the header not found');
		}

		callback(400,{'Error':errorObject});

	}
}


module.exports = states;
