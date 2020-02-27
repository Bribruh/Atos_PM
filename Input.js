//Inserting into Mongo: https://www.w3schools.com/nodejs/nodejs_mongodb_insert.asp

//Express: Configuration Details
var express = require('express');
var path = require("path");
var app = express();

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
    var myID = request.query.myID;
    var myName = request.query.myName;
    var myPrice = request.query.myPrice;
    var myAuthor = request.query.myAuthor;
    var myCategory = request.query.myCategory;

    //console.log(myID);
    //console.log(myName);
    //console.log(myPrice);
    //console.log(myAuthor);
    //console.log(myCategory);

    if (myID != "") {
        response.send("Responses Recorded");

    } else {
        response.send("Please provide an input");
    }

    //FOR MONGO
    //Mongo: Setting up Mongo-Node Driver
    const MongoClient = require('mongodb').MongoClient;
    const assert = require('assert');

    // Connection URL
    const url = 'mongodb://localhost:27017/BookstoreDb';

    // Database Name
    const dbName = 'BookstoreDb';

    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);
        var collection = db.collection('Books');

        //User created data object with all fields
        var myObj = { _id: myID, Name: myName, Price: myPrice, Category: myCategory, Author: myAuthor };
        //Inserts into MongoDB
        collection.insertOne(myObj, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
        });

        client.close();
    });
});

app.listen(8080);
console.log('8080 is the magic port');

