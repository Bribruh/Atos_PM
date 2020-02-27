//FOR EXPRESS

//Express: Configuration Details
var express = require('express');
var path = require("path");
var app = express();
var mongoose = require('mongoose'); 

//Express: setting static path
app.use(express.static(path.join(__dirname, 'views')));
//Express: Changing the view enging
app.set('view engine', 'ejs');

//FOR MONGO

//Mongo: Setting up Mongo-Node Driver
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://10.128.0.9:80';

// Database Name
const dbName = 'AtosDB';


mongoose.connect('mongodb://10.128.0.9:80/AtosDB');
app.listen(8080, 10.128.0.10);
console.log("App listening on port 8080");
