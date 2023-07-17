var nodemailer = require('nodemailer');
const User = require('../models/userModel')

var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
  user: process.env.GMAIL,
  pass: process.env.PASS
 }
});


var sendMailer = async (email, id) => {
 var otp = Math.floor(Math.random() * 9000 + 1000);
 var url = `${process.env.URL}/verify/?otp=${otp}&id=${id}`;
 var options = {
  from: process.env.GMAIL,
  to: email,
  subject: 'Reset Password!!',
  html: `The link to reset password is <a href="${url}">this</a>. Valid for 10 minutes.`
 }

 let send = new Promise(function (resolve) {
  transporter.sendMail(options, function (error, info) {
   if (error) throw error;
   if (info.response.split(' ')[0] == 250) {
    User.updateOne({
     email
    }, {
     otp
    }, (err) => {
     if (err) {
      resolve(false);
     }
    })
    setTimeout(() => {
     User.updateOne({
      email
     }, {
      otp: null
     }, (err) => {
      if (err) {
       console.log(err);
      }
     })
    }, 10 * 60 * 1000);
    resolve(true);
   } else {
    resolve(false);
   }
  })
 })
 await send;
 return send;
}

module.exports = sendMailer;