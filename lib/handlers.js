
const helpers = require('./helpers');
const config = require('./config');
const users = require('./../modules/users');
const login = require('./../modules/login');
const posts = require('./../modules/posts');
const profiles = require('./../modules/profiles');
const reactions = require('./../modules/reactions');

let handlers = {};


handlers.notFound = (data,callback)=>{

	callback(404,{'Error':'EndPoint not found'});

}

handlers.users = (data,callback)=>{
	
	let acceptableMethods = ['post','get','put','delete','options'];
	// console.log('data from here ', data);
	console.log(users.options);
	if(acceptableMethods.indexOf(data.method) > -1){
		// console.log('Method HERE : ' + data.method);
		users[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}




handlers.login = (data,callback)=>{
	
	let acceptableMethods = ['post','options'];
	// console.log('data from here ', data);
	if(acceptableMethods.indexOf(data.method) > -1){

		login[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}



handlers.profiles = (data,callback)=>{
	
	let acceptableMethods = ['post','get','put','options'];
	// console.log('data from here ', data);
	if(acceptableMethods.indexOf(data.method) > -1){

		profiles[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}



handlers.posts = (data,callback)=>{
	
	let acceptableMethods = ['post','get','put','delete','options'];
	
	if(acceptableMethods.indexOf(data.method) > -1){

		posts[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}


handlers.comments = (data,callback)=>{
	
	let acceptableMethods = ['post','get','put','delete','options'];
	// console.log('data from here ', data);
	if(acceptableMethods.indexOf(data.method) > -1){

		comments[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}


handlers.reactions = (data,callback)=>{
	
	let acceptableMethods = ['get','delete','options'];
	// console.log('data from here ', data);
	if(acceptableMethods.indexOf(data.method) > -1){

		reactions[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}


module.exports = handlers;