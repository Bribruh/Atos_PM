//Inserting into Mongo: https://www.w3schools.com/nodejs/nodejs_mongodb_insert.asp

//Express: Configuration Details
var express = require('express');
var path = require("path");
var app = express();
var morgan = require('morgan'); 
var argv = require('optimist').argv;

//Express: setting static path
app.use(express.static(path.join(__dirname, 'views')));
//Express: Changing the view enging
app.set('view engine', 'ejs');

//Renders Input EJS file
app.get('/', function (req, res) {
    res.render('Input');
});

//Finds getInput function in EJS file
app.get("/getInput", function (request, response) {
    //User Input from rendered EJS file
    var myName = request.query.myName;
    var myNumber = request.query.myNumber;

    //console.log(myID);
    //console.log(myName);
    //console.log(myPrice);
    //console.log(myAuthor);
    //console.log(myCategory);

    if (myName != "") {
        response.send("Responses Recorded");

    } else {
        response.send("Please provide an input");
    }
	
	

    mongoose.connect('mongodb://' + argv.be_ip + ':80/AtosDB');
	var Project = mongoose.model('Project', {
		name : String,
		Pnumber: Number
	});


	var insertP = new Project({name: myName, Pnumber: myNumber});
	insertP.save(function (err) {
  if (err) return handleError(err);
  // saved!
});

    
});

app.listen(8080);
console.log('8080 is the magic port');

