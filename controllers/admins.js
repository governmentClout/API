
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const tokens = require('./../lib/tokenization');



blank = {};

blank.options = (data,callback)=>{

	callback(200,data.headers);
	
}

blank.post = (data,callback)=>{

}

blank.get = (data,callback)=>{

}


module.exports = blank;