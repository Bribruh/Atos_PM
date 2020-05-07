//Executes connection into MongoDB and accesses AtosDB
var Connect = require('./Connect');

//Defined model from MongoDB
var Project = Connect.Project;

//Defined model from MongoDB
var ProjectR = Connect.ProjectR;

//Defined model from MongoDB
var ProjectC = Connect.ProjectC;

//Defined model from MongoDB
var Account = Connect.Account

Project.deleteMany({}, function (err) {
  if (err) return handleError(err);
  console.log("Project Colllection Reset");
  ProjectR.deleteMany({}, function (err) {
	  if (err) return handleError(err);
	  console.log("Project Tracking Colllection Reset");
	 ProjectC.deleteMany({}, function (err) {
			if (err) return handleError(err);
			console.log("Project Resource Colllection Reset");
			process.exit(-1);
			
		});


	});


});

