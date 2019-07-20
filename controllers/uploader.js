

const config = require('./../lib/config');
const cloudinary = require('cloudinary');
const mysql = require('mysql');

cloudinary.config({ 
  cloud_name: 'staybusy', 
  api_key: '513764555178418', 
  api_secret: 'NJCsxMKkJ1H6-5QsfPd3HkLohHA' 
});

const con = require('./../lib/db');

uploader = {};



uploader.send = (data)=>{

	cloudinary.v2.uploader.upload(data.file, 
  	function(error, result) {
  		let update = "UPDATE "+data.table+" SET "+data.column+" ='"+result.url+"' WHERE uuid='"+data.uuid+"'";

  		con.query(update,(err,result)=>{
  			if(!err){
  				console.log(result);
  			}else{
  				console.log(err);
  			}
  		});

  	});

}



module.exports = uploader;
