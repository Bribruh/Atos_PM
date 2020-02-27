//FOR EXPRESS

//Express: Configuration Details
var express = require('express');
var path = require("path");
var app = express();
var mongoose = require('mongoose'); 
var morgan = require('morgan'); 
var argv = require('optimist').argv;

//Express: setting static path
app.use(express.static(path.join(__dirname, 'views')));
//Express: Changing the view enging
app.set('view engine', 'ejs');

//FOR MONGO


mongoose.connect('mongodb://10.128.0.9:80/AtosDB');
app.listen(8080, argv.fe_ip);
console.log("App listening on port 8080");
