
const config = require('./../lib/config');
const con = require('./../lib/db');


lga = {};

states.options = (data,callback)=>{

	callback(200,data.headers);
	
}


/**
 * @api {get} /lga/:uuid get LGAs 
 * @apiName getLga
 * @apiGroup LGA
 * @apiHeader {String} uuid Authorization UUID.
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint deletes a petition
 * @apiParam {String} uuid UUID of the state
 *
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
{
    
}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 404 Bad Request
{
   
}

*/


lga.get = (data,callback)=>{
        //return all states
}


module.exports = lga;
