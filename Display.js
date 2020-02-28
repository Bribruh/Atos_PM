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


mongoose.connect('mongodb://' + argv.be_ip + ':80/AtosDB');

// define model =================
	var Project = mongoose.model('Project', {
		name : String,
		Pnumber: Number
	});

Project.
  findOne({}).
  exec(function (err, p) {
    if (err) return handleError(err);
    console.log(' %s', p.name);
    // prints "The author is Ian Fleming"
  });

app.listen(8080, argv.fe_ip);
console.log("App listening on port 8080");
