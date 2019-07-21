
const helpers = require('./../lib/helpers');
const uuidV1 = require('uuid/v4');
const config = require('./../lib/config');
const tokens = require('./../lib/tokenization');


notitications = {};

notitications.options = (data,callback)=>{

	callback(200,data.headers);
	
}

notitications.add = (data)=>{
	//post notification
	//notice message
	//uuid of user
	let actionName = typeof(data.name) == 'string' && data.name.trim().length > 0 ? data.name.trim() : false;
	let user = typeof(data.uuid) =='string' && data.uuid.trim().length > 0 ? data.uuid.trim() : false;
	let message = typeof(data.message) == 'string' && data.message.trim().length > 0 ? data.message.trim() : false;
	let link = typeof(data.link) == 'string' && data.link.trim().length > 0 ? data.link.trim() : false;


	if(actionName && user && message && link){
		let noticeSQL = "INSERT INTO notifications (actionName,user,message,link) VALUES"
		con.query()

	}else{
		console.log('missing required parameters');
	}

}


notitications.post = (data,callback)=>{
	//mark notification as read
	
}

notitications.get = (data,callback)=>{
	//get notifications
	//get notification relating to single user
}




module.exports = notitications;
