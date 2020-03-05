//CSV Parser
const csv = require('csv-parser')
const fs = require('fs')
const results = [];

//Imports column data from CSV stored in root folder
fs.createReadStream('columnData.csv')
    //CSV Header format
    .pipe(csv(['headerName', 'field', 'sortable', 'filter']))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        //console.log(results);
    });

//Express: Configuration Details
var express = require('express');
var path = require("path");
var app = express();

//Express: setting static path
app.use(express.static(path.join(__dirname, 'views')));
//Express: Changing the view enging
app.set('view engine', 'ejs');

//Mongoose
var mongoose = require('mongoose'); 
var morgan = require('morgan'); 
var argv = require('optimist').argv;

//Executes connection into MongoDB and accesses AtosDB
var Connect = require("./Connect");

//Defined model from MongoDB
var Project = Connect.Project;

//Global array to store all mongo db data entries
const myProjects = [];

Project.find({}, function (err, p) {
    if (err) return handleError(err);
    for (var i = 0; i < p.length; i++){
            //Stores every data point into myArray
            myProjects.push(p[i]);
            //console.log(myProjects[i]);
        }

	app.get('/', function (req, res) {
            //Passes data values from Mongo over to EJS file to be rendered
            res.render('Index', {myArray: myProjects, myColumn: results});
        });
	
	
	app.listen(8080);
console.log("App listening on port 8080");
	
  });


