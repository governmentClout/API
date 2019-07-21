
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mailer = require('./mailer');


userexecutives = {}; 

userexecutives.options = (data,callback)=>{

	callback(200,data.headers);
	
}

userexecutives.get = (data,callback)=>{

    let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
	let uuidHeader = typeof(data.headers.uuid) == 'string' && data.headers.uuid.trim() ? data.headers.uuid.trim() : false;

    let user = typeof(data.param) == 'string' && data.param.trim().length > 0 ? data.param.trim() : false;
    
    if( 
		token && 
        uuidHeader &&
        user
		 
		){

            //get all executives pertaining to this user
            //select executive based on user location.
            /**
             * - president
             * - governor
             * - council chairman
             * - senator --> select * from executive where office is senator, then go to profile, and select * from
             * - federal rep
             * - state rep 
             * 
             */

             

             callback(200,{'executives':{
                 'president':president,
                 'governor': governor,
                 'chairman': chairman,
                 'senator': senator,
                 'fed_rep':fed_rep,
                 'state_rep':state_rep
             }})
            


        }else{

			let errorObject = [];
	
			if(!token){
				errorObject.push('Token you supplied is not valid or expired');
			}
			if(!uuidHeader){
				errorObject.push('uuid in the header not found');
            }
            if(!user){
                errorObject.push('user uuid is not specified')
            }
	
			callback(400,{'Error':errorObject});
		}
    
}
