const _db = require('./db');
const helpers = require('./helpers');

let routers = {};



routers.notFound = (data,callback)=>{
	callback(404);
}

