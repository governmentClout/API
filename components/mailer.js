
const config = require('./../lib/config');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');


let readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

let mailer = {};

let transporter = nodemailer.createTransport({

  host: config.email_host,
  port: config.email_port,
  auth: {
    user: config.email_user,
    pass: config.email_pass
  }

});


mailer.send = (data)=>{
//data should have [receiver_uuid,message,subject]
//get user details from database
//send email to the user specified

let to = data.email;
let subject = data.subject;
let message = data.message;

// let mailOptions = {
//   from: 'youremail@gmail.com',
//   to: to,
//   subject: subject,
//   html: {
//   	path: __dirname + 'email.html',
//   	subject: subject,
//   	message: message
//   }
// };

readHTMLFile(__dirname + '/email.html', function(err, html) {
    let template = handlebars.compile(html);
    let replacements = {
         subject: subject,
         message: message
    };
    let htmlToSend = template(replacements);

    let mailOptions = {
	  from: 'info@gclout.com',
	  to: to,
	  subject: subject,
	  html: htmlToSend
	};

    transporter.sendMail(mailOptions, function(error, info){

	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});
});



}

module.exports = mailer;