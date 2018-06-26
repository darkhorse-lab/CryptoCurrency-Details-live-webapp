var express = require('express');

var app = express();
var multer = require('multer')
var constants = require('constants');
var constant = require('./config/constants'); // V.V.I. jegula te path thakbe .. shegula hocce exports/create kora module...

var port = process.env.PORT || 8042;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var dateFormat = require('dateformat');
var now = new Date();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/***************Mongodb configuratrion********************/
var mongoose = require('mongoose');
var configDB = require('./config/database.js');
//configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
