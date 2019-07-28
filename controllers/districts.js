'use strict'

const models = require('./../models/index');
const token = require('./../controllers/tokens');



districts = {};

districts.options = (data,callback)=>{

	callback(200,data.headers);
	
}

//get all districts
//get all districts inside a state


/**
 * @api {get} /districts/:id?sort=:sort&limi=:limit&page=:page get Single Party 
 * @apiName getSingleParty
 * @apiGroup LGA
 * @apiHeader {String} uuid Authorization UUID.
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint returns all states lga
 * @apiParam {String} id id of the state
 * @apiParam {String} page page you wish to get (pagination)
 * @apiParam {String} limit result count per page you wish to get (pagination)
 * @apiParam {String} sort result sort [ASC | DESC] (pagination)
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
{
     "districts": [
        {
            "id": 30,
            "state_id": 10,
            "name": "DELTA SOUTH",
            "code": "SD/030/DT"
        },
        {
            "id": 29,
            "state_id": 10,
            "name": "DELTA NORTH",
            "code": "SD/029/DT"
        },
        {
            "id": 28,
            "state_id": 10,
            "name": "DELTA CENTRAL",
            "code": "SD/028/DT"
        }
        .
        .
        .
    ]
}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 404 Bad Request
{
   "Error": null
}

*/

/**
 * @api {get} /districts?sort=:sort&limi=:limit&page=:page get Parties 
 * @apiName getAllParties
 * @apiGroup Parties
 * @apiHeader {String} uuid Authorization UUID.
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint returns all  lga
 * @apiParam {String} page page you wish to get (pagination)
 * @apiParam {String} limit result count per page you wish to get (pagination)
 * @apiParam {String} sort result sort [ASC | DESC] (pagination)
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK 
{
    "districts": [
        {
            "id": 9,
            "state_id": 2,
            "name": "ADAMAWA CENTRAL",
            "code": "SD/006/AD"
        },
        {
            "id": 8,
            "state_id": 2,
            "name": "ADAMAWA SOUTH",
            "code": "SD/005/AD"
        },
        {
            "id": 7,
            "state_id": 2,
            "name": "ADAMAWA NORTH",
            "code": "SD/004/AD"
        }
    ]
}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 404 Bad Request
{
    "Error": null
}
*/


districts.get = (data,callback)=>{

    let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
	let tokenHeader = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;

    let page = typeof(data.queryStringObject.page) == 'string'  ? data.queryStringObject.page : '1'; 
	let limit = typeof(data.queryStringObject.limit) == 'string' ? data.queryStringObject.limit : '10';
    let sort = typeof(data.queryStringObject.sort) == 'string' && data.queryStringObject.sort.trim().length > 0 && (data.queryStringObject.sort.trim() == 'ASC' || 'DESC') ? data.queryStringObject.sort.trim() : 'DESC';
	let state = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
        
        if( 
		token && 
		user 

		){

            token.verify(uuidHeader,tokenHeader).then((result)=>{
			
                if(!result){
                        callback(400,{'Error':'Token Mismatch or expired'});
                }			
            })
            .then(()=>{
                    if(state){

                        models.District
                        .findAndCountAll({ where: {stateId:state}, offset: page, limit: limit, order: [['name', sort]]})
                        .then((districts)=>callback(200,{districts})).catch((err)=>{
                            console.log(err);
                            callback(500,{err});
                        });

                    }else{
                        models.District
                        .findAndCountAll({ offset: page, limit: limit, order: [['name', sort]]})
                        .then((districts)=>callback(200,{districts})).catch((err)=>{
                            console.log(err);
                            callback(500,{err});
                        });
                    }
                   

            }).catch((err)=>{
                    //TODO: This should be optimzed
                    console.log(err);
                    callback(500,err);
            })	;	
                        

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


module.exports = districts;
