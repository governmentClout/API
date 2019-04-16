
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const mysql = require('mysql');
const tokens = require('./../lib/tokenization');

const con = require('../lib/db');


signatures = {};

signatures.options = (data,callback)=>{

	callback(200,data.headers);
	
}

signatures.post = (data,callback)=>{
    callback(200,{'Success':'Signature Post endpoint'});
}

signatures.get = (data,callback)=>{
    callback(200,{'Success':'Signature Get endpoint'});
}


signatures.delete = (data,callback)=>{
    callback(200,{'Success':'Signature Delete endpoint'});
}


module.exports = signatures;
