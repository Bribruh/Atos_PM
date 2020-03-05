
var mongoose = require('mongoose'); 
var morgan = require('morgan'); 
var argv = require('optimist').argv;


mongoose.connect('mongodb://' + argv.be_ip + ':80/AtosDB');


// define model =================
	var Project = mongoose.model('Atos_P', {}, 'Atos_P');

module.exports.Project = Project;

