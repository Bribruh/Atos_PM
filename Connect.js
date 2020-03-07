
var mongoose = require('mongoose'); 
var morgan = require('morgan'); 
var argv = require('optimist').argv;


//mongoose.connect('mongodb://' + argv.be_ip + ':80/AtosDB');
mongoose.connect('mongodb://localhost:27017/ProjectDB');


// define model =================
	//var Project = mongoose.model('AtosProjects', {}, 'AtosProjects');
	var Project = mongoose.model('Project', {}, 'Project'); 


module.exports.Project = Project;

