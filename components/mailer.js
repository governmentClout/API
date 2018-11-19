
const config = require('./../lib/config');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const async = require('async');
const mysql = require('mysql');


const con = mysql.createPool({

  host: config.db_host,
  user: config.db_username,
  password: config.db_password,
  database: config.db_name,
  multipleStatements: true

});


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

async.waterfall([
                function(callback) {

                    let getUserEmail = "SELECT email FROM uers WHERE uuid='"+data['uuid']+"'";
                    //get user email here
                
                }
            ], function (err, result) {

                let to = result.email;
                let subject = data['subject'];
                let message = data['message'];


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


          });




}

module.exports = mailer;