/**
Setting Up the server and Routes for the API
*/

const http = require('http');
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config');
const fs = require('fs');
const routers = require('./lib/routers');
const helpers = require('./lib/helpers');
const _db = require('./lib/db');


const httpServer = http.createServer((req,res)=>{

	unifiedServer(req,res);

});

httpServer.listen(config.httpPort, ()=>{

	console.log('Server Started on port ' + config.httpPort);

});

// const httpsServerOptions = {
// 	'key': fs.readFileSync('./https/key.pem'),
// 	'cert': fs.readFileSync('./https/cert.pem')
// };


// const httpsServer = https.createServer(httpsServerOptions, (req,res)=>{

// 	unifiedServer(req,res);

// });

// httpsServer.listen(config.httpsPort, ()=>{

// 	console.log('Server Started on port ' + config.httpsPort);

// });


var unifiedServer = (req,res)=>{
	
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

		let chosenHandler = typeof(route[trimmedPath]) !== 'undefined' ? route[trimmedPath] : routers.notFound;
		
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



let routes = {
	'users' : routers.users,
	'tokens': routers.tokens
};





