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
app.use(morgan('dev')); 
//FOR MONGO


mongoose.connect('mongodb://' + argv.be_ip + ':80/test');

// define model =================
	var Project = mongoose.model('Project', {
		name : String,
		Pnumber: Number
	});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
Project.find({}, function (err, docs) {
	if (err) return handleError(err);
	
	console.log('%s %s ', docs.name, docs.Pnumber);});


app.listen(8080, argv.fe_ip);
console.log("App listening on port 8080");
