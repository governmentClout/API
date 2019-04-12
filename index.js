/**
Setting Up the server and Routes for the API
*/

const http = require('http');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');
const dbconnect = require('./lib/db_connect');


const httpServer = http.createServer((req,res)=>{

	unifiedServer(req,res);

});

httpServer.listen(config.httpPort, ()=>{

	console.log('Server Started on port ' + config.httpPort);

});

var unifiedServer = (req,res)=>{

	
	const parsedUrl = url.parse(req.url,true);
	const path = parsedUrl.pathname; 
	const trimmedPath = path.replace(/^\/+|\/+$/g,'');
	const separatedUrl = trimmedPath.split('/');
	const route = separatedUrl[0]; //take out the first element from the array
	const param = separatedUrl[1]; //send the rest
	
	//pagination details

	const queryStringObject = parsedUrl.query;

	const method = req.method.toLowerCase();
	const headers = req.headers;
	const decoder = new stringDecoder('utf-8');

	let buffer = '';

	req.on('data', (data)=>{
		buffer += decoder.write(data);
	});

	req.on('end', ()=>{

		buffer += decoder.end();


		let chosenHandler = typeof(router[route]) !== 'undefined' ? router[route] : handlers.notFound;
		
		let data = {
			'trimmedPath' : route,
			'param': param,
			'queryStringObject' : queryStringObject,
			'method': method,
			'headers': headers,
			'payload': helpers.parseJsonToObject(buffer)
		}

		chosenHandler(data, (statusCode,payload)=>{
			
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			payload = typeof(payload) == 'object' ? payload : {};

			let payloadString = JSON.stringify(payload);


				res.setHeader("Access-Control-Allow-Origin","*");
				res.setHeader("Access-Control-Request-Headers","X-Requested-With,Origin,Content-Type,uuid,token");
				res.setHeader("Access-Control-Allow-Headers","Content-Type,uuid,token");
				res.setHeader("Access-Control-Allow-Methods","options, post, get, put, delete");
				res.setHeader("Content-Type","application/json, multipart/form-data, application/x-www-form-urlencoded");
				res.setHeader("Content-Control-Request-Headers","content-type");
				res.setHeader("Access-Control-Max-Age",2592000);

				res.writeHead(statusCode);

				res.end(payloadString);


		});


	});
}

/**
ROUTES
*/

let router = {
	'users' : handlers.users,
	'login' : handlers.login,
	'profiles' : handlers.profiles,
	'posts' : handlers.posts,
	'comments' : handlers.comments,
	'reactions' : handlers.reactions,
	'shares' : handlers.shares,
	'views': handlers.views,
	'friends': handlers.friends,
	'executives':handlers.executives,
	'trends':handlers.trends,
	'tests':handlers.tests,
	'articles': handlers.articles,
	'polls': handlers.polls,
	'petitions':handlers.petitions,
	'settings':handlers.settings,
	'admins':handlers.admin,
	'resets':handlers.resets,
	'messages':handlers.messages 
};





