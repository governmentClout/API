
const config = require('./../lib/config');
const con = require('./../lib/db');


states = {};

states.options = (data,callback)=>{

	callback(200,data.headers);
	
}



states.get = (data,callback)=>{
        //return all states
}


module.exports = states;
