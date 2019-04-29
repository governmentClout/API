
const config = require('./../lib/config');
const con = require('./../lib/db');


lga = {};

states.options = (data,callback)=>{

	callback(200,data.headers);
	
}



lga.get = (data,callback)=>{
        //return all states
}


module.exports = lga;
