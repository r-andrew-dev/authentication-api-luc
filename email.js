const sgMail = require('@sendgrid/mail');
const keys = require("./keys");
sgMail.setApiKey(keys.keys.sendgrid_api_key);
const msg = {
  to: 'test@example.com',
  from: 'test@example.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);