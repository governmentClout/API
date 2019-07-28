'use strict'

const config = require('./../lib/config');

let lga = {};

lga.options = (data,callback)=>{

	callback(200,data.headers);
	
}


/**
 * @api {get} /lga/:uuid?sort=:sort&limi=:limit&page=:page get All LGAs 
 * @apiName getAllLga
 * @apiGroup LGA
 * @apiHeader {String} uuid Authorization UUID.
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint returns all states lga
 * @apiParam {String} page page you wish to get (pagination)
 * @apiParam {String} limit result count per page you wish to get (pagination)
 * @apiParam {String} sort result sort [ASC | DESC] (pagination)
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
{
    "lga": [
        {
            "id": 17,
            "state_id": 2,
            "name": "Fufure"
        },
        {
            "id": 18,
            "state_id": 2,
            "name": "Ganye"
        },
        {
            "id": 19,
            "state_id": 2,
            "name": "Gayuk"
        },
        {
            "id": 20,
            "state_id": 2,
            "name": "Gombi"
        },
        {
            "id": 21,
            "state_id": 2,
            "name": "Grie"
        },
        {
            "id": 22,
            "state_id": 2,
            "name": "Hong"
        },
        {
            "id": 23,
            "state_id": 2,
            "name": "Jada"
        }
       
    ]

}
 *@apiErrorExample Error-Response:
 *HTTP/1.1 404 Bad Request
{
    "Error": null
}

*/

/**
 * @api {get} /lga/:uuid?sort=:sort&limi=:limit&page=:page get State LGAs 
 * @apiName getStateLgas
 * @apiGroup LGA
 * @apiHeader {String} uuid Authorization UUID.
 * @apiHeader {String} Token Authorization Token.
 * @apiDescription The endpoint returns all states lga
 * @apiParam {String} uuid UUID of the state
 * @apiParam {String} page page you wish to get (pagination)
 * @apiParam {String} limit result count per page you wish to get (pagination)
 * @apiParam {String} sort result sort [ASC | DESC] (pagination)
 *@apiSuccessExample Success-Response:
 *HTTP/1.1 200 OK
{
    "lga": [
        {
            "id": 17,
            "state_id": 2,
            "name": "Fufure"
        },
      
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


lga.get = (data,callback)=>{
    
    let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim().length > 0 ? data.headers.uuid.trim() : false;
	let tokenHeader = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;

    let page = typeof(data.queryStringObject.page) == 'string'  ? data.queryStringObject.page : 1; 
	let limit = typeof(data.queryStringObject.limit) == 'string' ? data.queryStringObject.limit : 10;
    let sort = typeof(data.queryStringObject.sort) == 'string' && data.queryStringObject.sort.trim().length > 0 && (data.queryStringObject.sort.trim() == 'ASC' || 'DESC') ? data.queryStringObject.sort.trim() : 'DESC';
    let district = typeof(data.queryStringObject.district) == 'string' && data.queryStringObject.district.trim().length > 0 ? data.queryStringObject.district.trim() : 'DESC';
	let state = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
        
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
                    if(state && district){

                        models.Lga
                        .findAndCountAll({ where: {stateId:state, districtId: district}, offset: page, limit: limit, order: [['name', sort]]})
                        .then((lgas)=>callback(200,{lgas})).catch((err)=>{
                            console.log(err);
                            callback(500,{err});
                        });

                    }else if(state && !district){

                        models.Lga
                        .findAndCountAll({ where: {stateId:state}, offset: page, limit: limit, order: [['name', sort]]})
                        .then((lgas)=>callback(200,{lgas})).catch((err)=>{
                            console.log(err);
                            callback(500,{err});
                        });

                    }else if(!state && district){

                        models.Lga
                        .findAndCountAll({ where: {districtId:district}, offset: page, limit: limit, order: [['name', sort]]})
                        .then((lgas)=>callback(200,{lgas})).catch((err)=>{
                            console.log(err);
                            callback(500,{err});
                        });

                    }else{
                        models.Lga
                        .findAndCountAll({ offset: page, limit: limit, order: [['name', sort]]})
                        .then((lgas)=>callback(200,{lgas})).catch((err)=>{
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


module.exports = lga;
