/*

Contains javascript functions for all database information handling: handles
project editing, version tracking, deletion, insertion, and other front-end
connectors. Also manages account registration, login, and viewing.

*/

//CSV Parser
const csv = require('csv-parser')
const fs = require('fs')
const results = [];
const resultsR = [];

//Imports column data from CSV stored in root folder
fs.createReadStream('columnData.csv')
    //CSV Header format
    .pipe(csv(['headerName', 'field','sortable', 'filter','filterParams']))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        //console.log(results);
    });

//Imports column data from CSV stored in root folder
fs.createReadStream('columnData-R.csv')
    //CSV Header format
    .pipe(csv(['headerName', 'field','sortable', 'filter','filterParams']))
    .on('data', (data) => resultsR.push(data))
    .on('end', () => {
        //console.log(results);
    });

//Express: Configuration Details
var express = require('express');
var path = require('path');
var app = express();

//Express: setting static path
app.use(express.static(path.join(__dirname, 'views')));
//Express: Changing the view enging
app.set('view engine', 'ejs');

//Allow app to parse JSON objects
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Initialize session to store user data (session-scoped)
var session = require('express-session')
process.env.SECRET_KEY = 'qwertyuiop'
app.use(session({secret:process.env.SECRET_KEY,
	resave: false, saveUninitialized: true})) // may need to transition to cookies

//Bcrypt to encrypt password data using Blowfish encryption
var bcrypt = require('bcrypt')

//Moment to generate date and time
var moment = require('moment'); 

//Optimist parse options and arguments
var argv = require('optimist').argv;

//Import JS file with functions to easily parse project data
var ProjData = require('./ProjectData')

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

//Function to parse user's input from HTML request in the proper schema form
function parseHTML(request){
	var p=  {Project_Data:[{APN:'',Lifecycle:request.query.Lifecycle,CNA_Ref_Num:request.query.CNA_Ref_Num,Name:request.query.Name,Initiative:request.query.Initiative,CNA_Sub_Portfolio:request.query.CNA_Sub_Portfolio,CNA_Priority:request.query.CNA_Priority,CNA_Request:request.query.CNA_Request,CNA_Country:request.query.CNA_Country,IDemand_Num:request.query.IDemand_Num,Salesforce_Case:request.query.Salesforce_Case,Salesforce_Opportunity:request.query.Salesforce_Opportunity,Created_By:'test_admin',Created_At:moment().format('MMMMDoYYYY,h:mm:ssa'),Last_Modified_At:'test_admin',Modified_At:moment().format('MMMMDoYYYY,h:mm:ssa')}],Project_Description:[{Description:request.query.Description,Business_Justification:request.query.Business_Justification,CNA_Implement_Date:request.query.CNA_Implement_Date}],CNA_Info:[{Requestor_Name:request.query.Requestor_Name,Sponsor:request.query.Sponsor,Architect:request.query.Architect,Project_Manager:request.query.CNA_Project_Manager,Project_Contact:request.query.Project_Contact}],ATOS_Assignment:[{Demand_Owner:request.query.Demand_Owner,Assigned_To:request.query.Assigned_To,Program_Name:request.query.Program_Name,Project_WBS_Code:request.query.Project_WBS_Code,Solution_Architect:request.query.Solution_Architect,SA_Assigned_Date:request.query.SA_Assigned_Date,Project_Manager:request.query.Atos_Project_Manager,PM_Assigned_Date:request.query.PM_Assigned_Date}],Solution_Design_Info:[{Solution_Architect:request.query.Atos_Solution_Architect,Complexity:request.query.Complexity,Difficulty:request.query.Difficulty,Req_RAG_Status:request.query.Req_RAG_Status,Req_Gathering_Start:request.query.Req_Gathering_Start,Req_Completion_Date:request.query.Req_Completion_Date,Req_Sent_Approval:request.query.Req_Sent_Approval,Req_Sign_Date:request.query.Req_Sign_Date,SD_RAG_Status:request.query.SD_RAG_Status,SD_Completion_Date:request.query.SD_Completion_Date,SD_Sign_Date:request.query.SD_Sign_Date,Proposal_Version:request.query.Proposal_Version,SA_Notes:request.query.SA_Notes,Peer_Reviewed:request.query.Peer_Reviewed,Peer_Reviewer:request.query.Peer_Reviewer,Peer_Reviewed_Date:request.query.Peer_Reviewed_Date,QA_Reviewed:request.query.QA_Reviewed,QA_Reviewer:request.query.QA_Reviewer,QA_Reviewed_Date:request.query.QA_Reviewed_Date,Scope_Changed:request.query.Scope_Changed,Scope_Change_Date:request.query.Scope_Change_Date,Scope_Change_Num:request.query.Scope_Change_Num,Days_Req_Gathering:'test_filler',Days_Solution_Design:'test_filler',Total_Days_Solutioning:'test_filler'}],PM_Execution_Info:[{ATOS_PM:request.query.ATOS_PM,Execution_Start_Date:request.query.Execution_Start_Date,Execution_Days:'test_filler',Planning_End_Date:request.query.Planning_End_Date,Baseline_Project_End_Date:request.query.Baseline_Project_End_Date,Baseline_Date_Change:request.query.Baseline_Date_Change,Project_End_Date:request.query.Project_End_Date,Project_Percent:request.query.Project_Percent,Project_RAG_Status:request.query.Project_RAG_Status,Scope_RAG:request.query.Scope_RAG,Schedule_RAG:request.query.Schedule_RAG,Budget_RAG:request.query.Budget_RAG,Baseline_Date:moment().format('MMMMDoYYYY,h:mm:ssa'),Status_Date:request.query.Status_Date,Status_Summary:request.query.Status_Summary,Executive_Summary:request.query.Executive_Summary,Weekly_Highlights:request.query.Weekly_Highlights,Upcoming:request.query.Upcoming}],Documentation:[{ATOS_PMO_URL:request.query.ATOS_PMO_URL,Collab_URL:request.query.Collab_URL,Finance_URL:request.query.Finance_URL,Notes:request.query.Notes,History:request.query.History}], V:''};
	  return p;
}

//Function to render main Display page
function renderDisplay(response){
	//Find all projects in collection
	Project.find({}, function (err, p) {
		//Global array to store all mongo db data entries
		var myProjects = [];
		if (err) return handleError(err);
		for (var i = 0; i < p.length; i++){
			//Stores every data point into myArray
			myProjects.push(p[i]);
		}
		//Passes data values from Mongo over to EJS file to be rendered
		response.render('Index', {myArray: myProjects, myColumn: results});	
	});
}

//Function to render main Display page
function renderDisplayR(response,APN){
	//Find all projects in collection
	ProjectR.find({'Project_Data.APN' : APN}, function (err, p) {
		//Global array to store all mongo db data entries
		var myProjects = [];
		if (err) return handleError(err);
		for (var i = 0; i < p.length; i++){
			//Stores every data point into myArray
			myProjects.push(p[i]);
		}
		console.log(myProjects);
		//Passes data values from Mongo over to EJS file to be rendered
		response.render('Index-R', {myArray: myProjects, myColumn: resultsR});	
	});
}

//Function to render main Display page
function renderDisplayH(response){
	//Find all projects in collection
	ProjectR.find({'V' : 0}, function (err, p) {
		//Global array to store all mongo db data entries
		var myProjects = [];
		if (err) return handleError(err);
		for (var i = 0; i < p.length; i++){
			//Stores every data point into myArray
			myProjects.push(p[i]);
		}
		console.log(myProjects);
		//Passes data values from Mongo over to EJS file to be rendered
		response.render('History', {myArray: myProjects, myColumn: results});	
	});
}

// Render Login.ejs if user is not logged in, Display(Index.ejs) otherwise
app.listen(8080)
console.log('App listening on port 8080')

app.get('/', function (req, res) {

	var user = req.session.user
	if (!user) {
		console.log('User not logged in')
		res.render('Login')
	} else {
		console.log('User ' + user.username + ' is logged in')
		var projects = ProjData.projects
		var columns = ProjData.columns
    	res.render('Index', {myArray: projects, myColumn: columns})
	}
})

//Render Display(Indes.ejs) upon js execution
/*Project.find({}, function (err, p) {
	//Global array to store all mongo db data entries
	var myProjects = [];
    if (err) return handleError(err);
    for (var i = 0; i < p.length; i++){
        //Stores every data point into myArray
        myProjects.push(p[i]);
    }
	//Executes GET method to specified app route
	app.get('/', function (req, res) {
        //Passes data values from Mongo over to EJS file to be rendered
        res.render('Index', {myArray: myProjects, myColumn: results});
    });
	app.listen(8080);
	console.log("App listening on port 8080");
});*/

//////////////// Dashboard Routing //////////////////////////////////////

//Displays dashboard page
app.get('/displayDashboard', function (req, res) {
	res.render('Dashboard');
});

//Displays project table 
app.get('/displayTable', function (req, res) {
	Project.find({}, function (err, p) {
		//Global array to store all mongo db data entries
		var myProjects = [];
		if (err) return handleError(err);
		for (var i = 0; i < p.length; i++) {
			//Stores every data point into myArray
			myProjects.push(p[i]);
		}
		//Passes data values from Mongo over to EJS file to be rendered
		res.render('Index', { myArray: myProjects, myColumn: results });
	});
});

//Displays custom view selector page
app.get('/displayCustom', function (req, res) {
	res.render('Custom', { myArray: myColumns });
});

//Displays pulldown modifier page
app.get('/displayPulldown', function (req, res) {
	res.render('Pulldown', { myArray: myOptions, myVal: [], mySelectedCSV: "" });
});

//Displays Version History page
app.get('/displayHistory', function (req, res) {
	renderDisplayH(res);
});

//Displays Project Input page
app.get("/displayInput", function (req, res) {
	//Removes all duplicates and passes them to be rendered
	var myBudgetRAG =remove_duplicates(budgetRAG);
	var myComplexity = remove_duplicates(complexity);
	var myDifficulty = remove_duplicates(difficulty);
	var myLifecycle = remove_duplicates(lifecycle);
	var myProgramName = remove_duplicates(programName);
	var myProjectRAG = remove_duplicates(projectRAG);
	var myRequirementsRAG = remove_duplicates(requirementsRAG);
	var myScheduleRAG = remove_duplicates(scheduleRAG);
	var myScopeRAG = remove_duplicates(scopeRAG);
	var mySDRAG = remove_duplicates(sdRAG);

	//Renders input page with values from each CSV file
	res.render('Input', { myBudgetRAG: myBudgetRAG, myComplexity: myComplexity, myDifficulty: myDifficulty, myLifecycle: myLifecycle, myProgramName: myProgramName, myProjectRAG: myProjectRAG, myRequirements: myRequirementsRAG, myScheduleRAG: myScheduleRAG, myScopeRAG: myScopeRAG, mySDRAG: mySDRAG});
});

// Account information screen
app.get('/displayAccount', (req, res) => {
	// Assure that user is logged in
	var user = req.session.user
	if (!user) {
		console.log('User not logged in')
		res.render('Login')
	} else {
		// User is logged in, load information
		res.render('Account', { user: user })
	}
})

//////////////// Project functions //////////////////////////////////////

//Reads user-input and adds into CSV file
app.get("/addNewOption", function (request, response) {
	//User inputted option
	var newOption = request.query.newOption;
	//CSV folder path
	var myCSV = myPulldownData;
	//Option field type
	var myField = myPulldown.replace('.csv', '');

	//CSV-write-streamd dependency
	var csvWriter = require('csv-write-stream');

	//Sets headers for csv-write-stream if file exists already
	if (!fs.existsSync(myCSV))
		writer = csvWriter({ headers: ["Option", "Field"] });
	else
		writer = csvWriter({ sendHeaders: false });

	//Appends user-input text into specified CSV file
	writer.pipe(fs.createWriteStream(myCSV, { flags: 'a' }));
	writer.write({ Option: newOption, Field: myField, });
	writer.end();

	//Renders over blank pulldown modfication apge
	response.render('Pulldown', { myArray: myOptions, myVal: [], mySelectedCSV: "" });
});

//Executes GET method to specified app route (edit button on Index.js)
app.get("/edit", function (request, response){
	//Retreive user's row (project) selection from HTML request
	var sel = request.query.selection2;
	console.log(sel);
	//Retreive selected project data from Database
	Project.findOne({'Project_Data.APN' : sel}, function (err, p) {
		if (err) return handleError(err);
		console.log(p.__v);
		//Render Modify.ejs and pass selected project data
		response.render('Modify', {p});
	}); 
});

//Takes selected input from EJS and renders over AG-Grid based on column data inside CSV
app.get("/renderView", function (request, response) {

	//User selected column data
	var myCustomView = request.query.customView;
	//console.log(myCustomView);

	//Path to selected CSV file
	var myColData = "./columnData/" + myCustomView;

	//console.log(myColData);
	const myData = [];

	fs.createReadStream(myColData)
		//CSV Header format
		.pipe(csv(['headerName', 'field', 'sortable', 'filter', 'filterParams']))
		.on('data', (data) => myData.push(data))
		.on('end', () => {
			//console.log(myData);
		});

	//Mongoose
	var argv = require('optimist').argv;

	//Executes connection into MongoDB and accesses AtosDB
	var Connect = require("./Connect");

	//Defined model from MongoDB
	var Project = Connect.Project;

	//Defined connection from MongoDB
	var mongoose = Connect.mongoose;

	Project.find({}, function (err, p) {
		//Global array to store all mongo db data entries
		var myProjects = [];
		if (err) return handleError(err);
		for (var i = 0; i < p.length; i++) {
			//Stores every data point into myArray
			myProjects.push(p[i]);
			//console.log(myProjects[i]);
		}

		response.render('Index', { myArray: myProjects, myColumn: myData });
	});
});


//Executes GET method to specified app route (edit button on Index.js)
app.get("/vers", function (request, response){
	//Retreive user's row (project) selection from HTML request
	var sel = request.query.selection5;
	console.log(sel);
	//Render main project Display page
	renderDisplayR(response,sel);
});

//Executes GET method to specified app route (delete button on Index.js)
app.get("/del", function (request, response){
	//Retreive user's row (project) selection from HTML request
	var sel = request.query.selection4;
	console.log(sel); 
	Project.deleteOne({'Project_Data.APN' : sel}, function (err) {
	  if (err) return handleError(err);
	  //Render main project Display page
				renderDisplay(response);
	});
});

//Executes GET method to specified app route (view button on Index.js)
app.get("/view-R", function (request, response){
	//Retreive user's row (project) selection from HTML request
	var sel = request.query.selection2;
	var Vsel = request.query.selection3;
	console.log(sel+'.'+Vsel); 
	
	//Retreive selected project data from Database
	ProjectR.findOne({'Project_Data.APN' : sel, 'V':Vsel}, function (err, p) {
		if (err) return handleError(err);
		console.log(p); 
		//Render Modify.ejs and pass selected project data
		response.render('View-R', {p});
	}); 
	
});

//Executes GET method to specified app route (view button on Index.js)
app.get("/view", function (request, response){
	//Retreive user's row (project) selection from HTML request
	var sel = request.query.selection3;
	console.log(sel);

	//Retreive selected project data from Database
	Project.findOne({'Project_Data.APN' : sel}, function (err, p) {
		if (err) return handleError(err);
		console.log(p.__v); 
		//Render Modify.ejs and pass selected project data
		response.render('View', {p});
	}); 
});

//Executes GET method to specified app route (New button on Index.ejs)
app.get("/new", function (request, response){
	//Render Input.ejs for new project 
	response.render('Input');
});

//Executes GET method to specified app route (exit button on Input.ejs and Modify.ejs)
app.get("/cancel", function (request, response){
	//Render main project Display page
	renderDisplay(response);
});

//Executes GET method to specified app route (exit button on Input.ejs and Modify.ejs)
app.get("/cancel-R", function (request, response){
	//Render main project Display page
	renderDisplayR(response,request.query.APN);
});

//Executes GET method to specified app route (exit button on Input.ejs and Modify.ejs)
app.get("/cancel-H", function (request, response){
	//Render main project Display page
	renderDisplayH(response);
});


//Executes GET method to specified app route (Sumbit button on Modify.ejs)
app.get("/modify", function (request, response){
	var tVer;
	
	//Parse User input into Project schema for DB
	var updatedP = parseHTML(request);
	//Retreive APN of project to be updated from ejs file
	var myAPN = request.query.APN;
	//Assign APN value from ejs to APN of parsed project
	updatedP.Project_Data[0].APN = myAPN;
	
	//Assign APN value from ejs to APN of parsed project
	tVer = parseInt(request.query.Version);
	console.log(tVer);
	updatedP.V = tVer + 1;
	var newPR = new ProjectR(updatedP);
	console.log(newPR);
	
	
	//Find project with APN from DB collection and update project
		Project.findOneAndUpdate({'Project_Data.APN' : myAPN}, updatedP , function(err, doc) {
			if (err) return response.send(500, {error: err});
			console.log(updatedP.V);
			ProjectR.create(updatedP,function (err) {
				if (err) console.log(err);
					//Render main project Display page
					renderDisplay(response);
				});
			
		});
	
	
});

//Executes GET method to specified app route (Sumbit button on Input.ejs)
app.get("/input", function (request, response){
	//String to create apn
	var myAPN;
	//Count Projects in Collection
	ProjectC.findOne( {}, function(err, p){
		var num;
		if(p==null){num = 0; p = new ProjectC({count:num});}
		else{
			num = p.count;
		}
		myAPN = '' + num;
		//Append 0s
		while (myAPN.length < 10) {
			myAPN = '0' + myAPN;
		}
		//Parse User input into Project schema for DB
		var updatedP = parseHTML(request);
		//Assign APN value to APN of parsed project
		updatedP.Project_Data[0].APN = myAPN;
		//Save new Project to DB collection
		updatedP.V = 0;
		//Save new Project to DB collection
		var newP = new Project(updatedP);
		var newPR = new ProjectR(updatedP);
		p.count++;
		p.save(function (err) {
			newP.save(function (err) {
				if (err) console.log(err);
				newPR.save(function (err) {
				if (err) console.log(err);
					//Render main project Display page
					renderDisplay(response);
				});
			});
		});
		
		
	});	
});



//////////////// Account functions //////////////////////////////////////

// Display register screen
app.get('/displayRegister', (req, res) => {
	res.render('Register')
})

// Register screen, creates new account from html body
app.post('/register', (req, res) => {
	// If user doesn't already exist, encrypt pswd and put in db
	Account.findOne({
		username: req.body.usernamereg
	})
		.then(user => {
			// If username hasn't been taken
			if (!user) {
				// create new account
				var newAct = new Account({
					username: req.body.usernamereg,
					password: req.body.passwordreg,
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					email: req.body.email,
					role: req.body.role,
					company: req.body.company,
					date: new Date()
				})
				bcrypt.hash(req.body.passwordreg, 10, (err, hash) => {
					if (err) return console.error(err)
					newAct.password = hash
					newAct.save(err => {
						if (err) return console.error(err)
						console.log('User ' + newAct.username + ' successfully registered!')
					})
				})
				// Store user account in session
				req.session.user = newAct
				res.render('Dashboard')
				/*var projects = ProjData.projects
				var columns = ProjData.columns
				res.render('Index', { myArray: projects, myColumn: columns })*/
				// Username already exists
			} else {
				res.json({ error: 'User ' + req.body.usernamereg + ' already exists.' })
			}
		})
		.catch(err => {
			console.error(err)
			res.send('error detected - check console for details')
		})
})
// Login screen, validates username/password against db
app.post('/login', (req, res) => {
	Account.findOne({
		username: req.body.username
	})
		.then(user => {
			// If username exists in db
			if (user) {
				bcrypt.compare(req.body.password, user.password)
					.then(result => {
						// If passwords match
						if (result) {
							// Store user account in session
							req.session.user = user
							var projects = ProjData.projects
							var columns = ProjData.columns
							console.log('User ' + user.username + ' successfully logged in!')
							//res.render('Index', {myArray: projects, myColumn: columns})
							res.render('Dashboard')
							// If passwords do not match
						} else {
							console.log('User ' + req.body.username + ' input incorrect password')
							res.render('Login')
						}
					})
					.catch(err => {
						res.send('error: ' + err)
					})
				// If username not found in db
			} else {
				console.log('User ' + req.body.username + ' could not be found.')
				res.render('Login')
			}
		})
		.catch(err => {
			res.send('error: ' + err)
		})
})

// Log out current user
app.post('/logout', (req, res) => {
	req.session.user = null
	res.render('Login')
	console.log('User successfully logged out! Current user: ' + req.session.user)
})

// View accounts and decide what to edit
app.get('/viewAccounts', (req, res) => {
	// Get all users in database
	Account.find({}, (err, a) => {
		if (err) handleError(err)
		users = []
		for (var i = 0; i < a.length; i++) {
			users.push(a[i])
		}
		// Pass user list to display screen
		res.render('AccountDisplay', { myusers: users })
	})
})

// Display account edit screen
app.get('/editAccount', (req, res) => {
	// Get selected account
	var account = req.query.selection2
	Account.findOne({ username: account }, (err, user) => {
		if (err) handleError(err)
		// pass user to account edit screen
		res.render('ModifyAccount', { user: user })
	})
})

// Submit role edit to database
app.post('/submitAccountEdit', (req, res) => {
	// Get revised role
	var newRole = req.body.role
	// Update account with new value
	Account.findOneAndUpdate({ username: req.body.username },
		{ role: newRole }, (err, newUser) => {
		if (err) handleError(err)
		console.log('Changed ' + newUser.username + ' role to ' + newRole)
		// If current user is edited user, update session
		if (newUser.username == req.session.user.username)
			req.session.user.role = newRole
		console.log(req.session.user)
		// Return user to accounts screen
		Account.find({}, (err2, a) => {
			if (err2) handleError(err2)
			users = []
			for (var i = 0; i < a.length; i++) {
				users.push(a[i])
			}
			// Pass user list to display screen
			res.render('AccountDisplay', { myusers: users })
		})
	})
})

///////////////////////////// Admin Tools //////////////////////////////////////

//Modify Pulldown selections/////////////

//Utility function to remove duplicates 
function remove_duplicates(arr) {
	var obj = {};
	var ret_arr = [];
	for (var i = 0; i < arr.length; i++) {
		obj[arr[i]] = true;
	}
	for (var key in obj) {
		ret_arr.push(key);
	}
	return ret_arr;
}


//Global array to store all columnData.csv in columnData directory
var myVals = [];

var budgetRAG = [];
var complexity = [];
var difficulty = [];
var lifecycle = [];
var programName = [];
var projectRAG = [];
var requirementsRAG = [];
var scheduleRAG = [];
var scopeRAG = [];
var sdRAG = [];

//Set path variable into columnData directory
var pulldownOptionsPath = path.join(__dirname, 'pulldownOptions');

//Reads all folders inside directory
fs.readdir(pulldownOptionsPath, function (err, files) {
	//handling error
	if (err) {
		return console.log('Unable to scan directory: ' + err);
	}

	//Stores names of all csvs in directory into array
	for (var i = 0; i < files.length; i++) {
		//Stores every data point into myArray
		myVals.push(files[i]);
	}

	var myFiles = myVals.toString();
	//Stored CSV name in array
	var filesArray = myFiles.split(',');

	//Reads thorough all CSV files in folder and stores all values inside each CSV
	for (var j = 0; j < filesArray.length; j++) {
		var myPulldownOptions = "./pulldownOptions/".concat(filesArray[j]);
		//console.log(myPulldownOptions);
		var myresults = [];

		//Reads all pulldown options of each CSV from folder
		fs.createReadStream(myPulldownOptions)
			//CSV Header format
			.pipe(csv(['option', 'field']))
			.on('data', (data) => myresults.push(data))
			.on('end', () => {
				//console.log(myresults);			

				//Stores field value of pulldown csv
				var myData = [];
				//Stores option value of pulldown csv
				var myInput = [];

				for (var i = 0; i < myresults.length; i++) {
					myData.push(myresults[i].field);
					myInput.push(myresults[i].option);
				}

				//Sorts by field value of CSV and stores into relevant array
				for (var l = 0; l < myData.length; l++) {
					switch (myData[l]) {
						case "Budget RAG":
							budgetRAG.push(myInput[l]);
							break;
						case "Complexity":
							complexity.push(myInput[l]);
							break;
						case "Difficulty":
							difficulty.push(myInput[l]);
							break;
						case "Lifecycle":
							lifecycle.push(myInput[l]);
							break;
						case "Program_Name":
							programName.push(myInput[l]);
							break;
						case "Project RAG Status":
							projectRAG.push(myInput[l]);
							break;
						case "Requirements RAG Status":
							requirementsRAG.push(myInput[l]);
							break;
						case "Schedule RAG":
							scheduleRAG.push(myInput[l]);
							break;
						case "Scope RAG":
							scopeRAG.push(myInput[l]);
							break;
						case "Solution Design RAG Status":
							sdRAG.push(myInput[l]);
							break;
					}
				}
			});
	}
});

//Custom Views/////////////////////////

//Local variable to store all columns stored in columnData folder
var myColumns = [];
//Set path variable into columnData directory
const directoryPath = path.join(__dirname, 'columnData');

//Reads all folders inside directory
fs.readdir(directoryPath, function (err, files) {
	//handling error
	if (err) {
		return console.log('Unable to scan directory: ' + err);
	}

	//Stores names of all csvs in directory into array
	for (var i = 0; i < files.length; i++) {
		//Stores every data point into myArray
		myColumns.push(files[i]);
	}
});

//Global array to store all columnData.csv in columnData directory
var myOptions = [];
//Set path variable into columnData directory
const pulldownPath = path.join(__dirname, 'pulldownOptions');

//Reads all folders inside directory
fs.readdir(pulldownPath, function (err, files) {
	//handling error
	if (err) {
		return console.log('Unable to scan directory: ' + err);
	}

	//Stores names of all csvs in directory into array
	for (var i = 0; i < files.length; i++) {
		//Stores every data point into myArray
		myOptions.push(files[i]);
	}
});

//CSV File Folder Path
var myPulldownData;

//Selected CSV File
var myPulldown;

//Renders EJS file with all stored CSV files in folder
app.get("/renderPulldown", function (request, response) {
	//User selected column data
	myPulldown = request.query.Pulldown;
	//console.log(myPulldown);

	//Path to selected CSV file
	myPulldownData = "./pulldownOptions/" + myPulldown;
	//console.log(myPulldownData);

	//All stored CSV Files
	const table = [];

	//Reads all CSV files and pushes into local array
	fs.createReadStream(myPulldownData)
		//CSV Header format
		.pipe(csv(['option', 'field']))
		.on('data', (data) => table.push(data))
		.on('end', () => {
			//console.log(table);

			//Render over EJS file with all stored CSV file names and selected CSV file
			response.render('Pulldown', { myArray: myOptions, myVal: table, mySelectedCSV: myPulldown });
		});
});

