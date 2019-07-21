
const helpers = require('./helpers');
const config = require('./config');

//TODO: Create controller autoload lib module

const users = require('./../controllers/users');
const login = require('./../controllers/login');
const posts = require('./../controllers/posts');
const profiles = require('./../controllers/profiles');
const reactions = require('./../controllers/reactions');
const shares = require('./../controllers/shares');
const test = require('./../controllers/test');
const friends = require('./../controllers/friends');
const views = require('./../controllers/views');
const comments = require('./../controllers/comments.js');
const petitions = require('./../controllers/petitions');
const polls = require('./../controllers/polls');
const trends = require('./../controllers/trends');
const articles = require('./../controllers/articles');
const resets = require('./../controllers/resets');
const executives = require('./../controllers/executives');
const signatures = require('./../controllers/signatures');
const friendrequests = require('./../controllers/friendrequests');
const sendmessages = require('./../controllers/sendmessages');
const receivemessages = require('./../controllers/receivemessages');
const replymessages = require('./../controllers/replymessages');
const userexecutives = require('./../controllers/userexecutives');
const states = require('./../controllers/states');
const lga = require('./../controllers/lga');
const parties = require('./../controllers/parties');
const districts = require('./../controllers/districts');
const districtlga = require('./../controllers/districtlga');

let handlers = {};


handlers.notFound = (data,callback)=>{

	callback(404,{'Error':'EndPoint not found'});

}

handlers.users = (data,callback)=>{
	
	let acceptableMethods = ['post','get','put','delete','options'];

	console.log(users.options);
	if(acceptableMethods.indexOf(data.method) > -1){

		users[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}


handlers.login = (data,callback)=>{
	
	let acceptableMethods = ['post','options'];

	if(acceptableMethods.indexOf(data.method) > -1){

		login[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}


handlers.profiles = (data,callback)=>{
	
	let acceptableMethods = ['post','get','put','options'];

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

handlers.articles = (data,callback)=>{
	
	let acceptableMethods = ['post','get','put','delete','options'];
	
	if(acceptableMethods.indexOf(data.method) > -1){

		articles[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}


handlers.comments = (data,callback)=>{
	
	let acceptableMethods = ['post','get','put','delete','options'];

	if(acceptableMethods.indexOf(data.method) > -1){

		comments[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}


handlers.reactions = (data,callback)=>{
	
	let acceptableMethods = ['get','delete','options','post'];

	if(acceptableMethods.indexOf(data.method) > -1){

		reactions[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers.shares = (data,callback)=>{
	
	let acceptableMethods = ['get','post','options'];

	if(acceptableMethods.indexOf(data.method) > -1){

		shares[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers.tests = (data,callback)=>{
	
	let acceptableMethods = ['get','delete','options','put','post'];

	if(acceptableMethods.indexOf(data.method) > -1){

		test[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers.friends = (data,callback)=>{
	
	let acceptableMethods = ['get','delete','options','post'];

	if(acceptableMethods.indexOf(data.method) > -1){

		friends[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers.views = (data,callback)=>{
	
	let acceptableMethods = ['get','options','post'];
	
	if(acceptableMethods.indexOf(data.method) > -1){

		views[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers.executives = (data,callback)=>{
	
	let acceptableMethods = ['get','options','post'];

	if(acceptableMethods.indexOf(data.method) > -1){

		executives[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}


handlers.userexecutives = (data,callback)=>{
	
	let acceptableMethods = ['get','options'];

	if(acceptableMethods.indexOf(data.method) > -1){

		userexecutives[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}


// handlers.trends = (data,callback)=>{
	
// 	let acceptableMethods = ['get','options'];

// 	if(acceptableMethods.indexOf(data.method) > -1){

// 		trends[data.method](data,callback);

// 	}else{

// 		callback(405,{'Error':'Method not allowed'});

// 	}
// }

handlers.petitions = (data,callback)=>{
	
	let acceptableMethods = ['get','options','post','delete'];

	if(acceptableMethods.indexOf(data.method) > -1){

		petitions[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers.polls = (data,callback)=>{
	
	let acceptableMethods = ['get','options','post'];

	if(acceptableMethods.indexOf(data.method) > -1){

		polls[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers.recommendations = (data,callback)=>{
	
	let acceptableMethods = ['get','options'];

	if(acceptableMethods.indexOf(data.method) > -1){

		recommendations[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

// handlers.trends = (data,callback)=>{
	
// 	let acceptableMethods = ['get','options'];

// 	if(acceptableMethods.indexOf(data.method) > -1){

// 		trends[data.method](data,callback);

// 	}else{

// 		callback(405,{'Error':'Method not allowed'});

// 	}
// }

handlers.resets = (data,callback)=>{
	
	let acceptableMethods = ['post','put','options'];

	if(acceptableMethods.indexOf(data.method) > -1){

		resets[data.method](data,callback);
 
	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers.messages = (data,callback)=>{
	
	let acceptableMethods = ['post','get','options','delete'];

	if(acceptableMethods.indexOf(data.method) > -1){

		messages[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers.signatures = (data,callback)=>{
	
	let acceptableMethods = ['post','get','options','delete'];

	if(acceptableMethods.indexOf(data.method) > -1){

		signatures[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}
}

handlers.friendrequests = (data,callback)=>{

	let acceptableMethods = ['post','get','options','delete','put'];

	if(acceptableMethods.indexOf(data.method) > -1){

		friendrequests[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}

}

handlers.sendmessages = (data,callback)=>{

	let acceptableMethods = ['post','get','options','delete'];

	if(acceptableMethods.indexOf(data.method) > -1){

		sendmessages[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}

}

handlers.receivemessages = (data,callback)=>{

	let acceptableMethods = ['get','options'];

	if(acceptableMethods.indexOf(data.method) > -1){

		receivemessages[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}

}

handlers.replymessages = (data,callback)=>{

	let acceptableMethods = ['post','get','options','delete'];

	if(acceptableMethods.indexOf(data.method) > -1){

		replymessages[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}

}

handlers.states = (data,callback)=>{

	let acceptableMethods = ['get','options'];

	if(acceptableMethods.indexOf(data.method) > -1){

		states[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}

}

handlers.lga = (data,callback)=>{

	let acceptableMethods = ['get','options'];

	if(acceptableMethods.indexOf(data.method) > -1){

		lga[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}

}

handlers.parties = (data,callback)=>{

	let acceptableMethods = ['get','options'];

	if(acceptableMethods.indexOf(data.method) > -1){

		parties[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}

}

handlers.districts = (data,callback)=>{

	let acceptableMethods = ['get','options'];

	if(acceptableMethods.indexOf(data.method) > -1){

		districts[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}

}

handlers.districtlga = (data,callback)=>{

	let acceptableMethods = ['get','options'];

	if(acceptableMethods.indexOf(data.method) > -1){

		districtlga[data.method](data,callback);

	}else{

		callback(405,{'Error':'Method not allowed'});

	}

}

module.exports = handlers;