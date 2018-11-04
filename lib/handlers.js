
const helpers = require('./helpers');
const config = require('./config');
const users = require('./../components/users');
const login = require('./../components/login');
const posts = require('./../components/posts');
const profiles = require('./../components/profiles');
const reactions = require('./../components/reactions');
const shares = require('./../components/shares');
const test = require('./../components/test');
const friends = require('./../components/friends');
const views = require('./../components/views');


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

handlers.shares = (data,callback)=>{
	
	let acceptableMethods = ['get','delete','options'];
	// console.log('data from here ', data);
	if(acceptableMethods.indexOf(data.method) > -1){

		shares[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers.tests = (data,callback)=>{
	
	let acceptableMethods = ['get','delete','options','put','post'];
	// console.log('data from here ', data);
	if(acceptableMethods.indexOf(data.method) > -1){

		test[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers.friends = (data,callback)=>{
	
	let acceptableMethods = ['get','delete','options','post'];
	// console.log('data from here ', data);
	if(acceptableMethods.indexOf(data.method) > -1){

		friends[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers.views = (data,callback)=>{
	
	let acceptableMethods = ['get','delete','options','post'];
	// console.log('data from here ', data);
	if(acceptableMethods.indexOf(data.method) > -1){

		views[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers.executives = (data,callback)=>{
	
	let acceptableMethods = ['get','delete','options','post'];
	// console.log('data from here ', data);
	if(acceptableMethods.indexOf(data.method) > -1){

		executives[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}



module.exports = handlers;