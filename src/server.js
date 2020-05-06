require('dotenv').config();
const keys = require("../keys");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const path = require('path');

// setting up port
const connUri = keys.keys.mongo_local_conn

let PORT = process.env.PORT || 3000;

// -- create app 

// creating express app and configuring middleware for auth 
const app = express();

app.use(cors());

// for parsing app json
app.use(express.json());

// for parsing forms 
app.use(express.urlencoded({ extended: false }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// -- set up database

// configure mongoose's promise to global promise 
mongoose.promise = global.promise 
mongoose.connect(connUri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

const connection = mongoose.connection;
connection.once('open', () => console.log('MongoDB -- database connection established successfully!'));
connection.on('error', (err) => {
    console.log('MongoDB connection error. Please make sure MongoDB is running.' + err);
    process.exit();
});


// -- INITIALIZE PASSPORT MIDDLEWARE 
app.use(passport.initialize());
require("./middlewares/jwt")(passport);

// -- CONFIGURE ROUTES

require('./routes/index')(app);

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(keys.keys.sendgrid_api_key);
const msg = {
  to: 'test@example.com',
  from: 'test@example.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg).
catch(err => console.log(err));

// -- START SERVER 
app.listen(PORT, () => console.log('Server running on http://localhost' + PORT + '/'));
