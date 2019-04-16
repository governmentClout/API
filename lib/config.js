
const environments = {};

//@TODO: Update details to be in ..env file

environments.staging = {

	'httpPort' : 3000,
	'httpsPort' : 3001,
	'envName': 'staging',
	'hashingSecret': 'thisIsASecret',
	'db_host': '127.0.0.1',
	'db_username': 'root',
	'db_password' : '',
	'db_name': 'gclout_db',
	'email_host':'smtp.mailtrap.io',
	'email_port':'2525',
	'email_user':'98b27875a5d9af',
	'email_pass':'e8585de93be547'

	
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

