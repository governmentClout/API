/**
Setting Up the server and Routes for the API
*/

const http = require('http');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config');
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');
const dbconnect = require('./lib/db_connect');
const cors = require('cors');


const httpServer = http.createServer((req,res)=>{

	unifiedServer(req,res);

});

httpServer.listen(config.httpPort, ()=>{

	console.log('Server Started on port ' + config.httpPort);

});

var unifiedServer = (req,res)=>{	



	  // const head = {
	  //   'Access-Control-Allow-Origin': '*',
	  //   'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT',
	  //   'Access-Control-Max-Age': 2592000, 
	  //   'Content-Type' : 'text/plain charset=UTF-8',
	  //   'Access-Control-Allow-Headers' : ',content-type',
	  //   'Content-Type' : 'application/json charset=UTF-8',
	  //   'Content-Control-Request-Headers' : 'content-type'
	  // };

	 

	  	// res.writeHead(405, head);
  		// res.end(`${req.method} is not allowed for the request.`);
	
	const parsedUrl = url.parse(req.url,true);
	
	const path = parsedUrl.pathname; 
	const trimmedPath = path.replace(/^\/+|\/+$/g,'');
	const method = req.method.toLowerCase();
	const queryStringObject = parsedUrl.query;
	const headers = req.headers;
	const decoder = new stringDecoder('utf-8');

	let buffer = '';

	req.on('data', (data)=>{
		buffer += decoder.write(data);
	});

	req.on('end', ()=>{

		buffer += decoder.end();

		// console.log('buffer 1' + helpers.parseJsonToObject(buffer));

		let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
		
		let data = {
			'trimmedPath' : trimmedPath,
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
				res.setHeader("Access-Control-Allow-Headers","DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type");
				res.setHeader("Access-Control-Allow-Methods","OPTIONS, POST, GET, PUT,DELETE");
				res.setHeader("Content-Type","application/json");
				res.setHeader("Content-Control-Request-Headers","content-type");
				res.setHeader("Access-Control-Max-Age",2592000);

				res.setHeader('Content-Type','application/json');
				res.writeHead(statusCode);
				res.end(payloadString);

			console.log(trimmedPath,statusCode);
		});


	});
}

/**
ROUTES
*/



let router = {
	'users' : handlers.users,
	'login' : handlers.login,
	'profiles' : handlers.profiles
};





