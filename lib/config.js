
const environments = {};


environments.staging = {

	'httpPort' : 3000,
	'httpsPort' : 3001,
	'envName': 'staging',
	'hashingSecret': 'thisIsASecret',
	'db_host': '127.0.0.1',
	'db_username': 'root',
	'db_password' : 'password',
	'db_name': 'gclout_db'

	
};

environments.production = {

	'httpPort' : 5000,
	'httpsPort' : 5001,
	'envName' : 'production',
	'hashingSecret': 'thisIsAlsoASecret',
	'db_host': '127.0.0.1',
	'db_username': 'root',
	'db_password' : ''

};


let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;

