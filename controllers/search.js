
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');



search = {};

search.options = (data,callback)=>{

	callback(200,data.headers);
	
}

search.get = (data,callback)=>{
	//collect search parameter
	//parameter includes: component, details of search.
	
	callback(200,{'You have hit the trends get endpoint'});
	
}


module.exports = settings;
