
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');

settings = {};

settings.options = (data,callback)=>{

	callback(200,data.headers);
	
}

settings.get = (data,callback)=>{

	callback(200,{'You have hit the trends get endpoint'});
	
}


module.exports = settings;
