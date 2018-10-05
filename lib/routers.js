const _data = require('./data');
const helpers = require('./helpers');

let routers = {};



routers.notFound = (data,callback)=>{
	callback(404);
}

