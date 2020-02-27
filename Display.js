//FOR EXPRESS

//Express: Configuration Details
var express = require('express');
var path = require("path");
var app = express();

//Express: setting static path
app.use(express.static(path.join(__dirname, 'views')));
//Express: Changing the view enging
app.set('view engine', 'ejs');

//FOR MONGO

//Mongo: Setting up Mongo-Node Driver
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://10.128.0.9:80/AtosDB';

// Database Name
const dbName = 'AtosDB';

// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    var collection = db.collection('Projects');

    var myArray = [];

    //var myArray = collection.find().toArray(function (err, items) { });
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);

        for (var i = 0; i < docs.length; i++){
            //Stores every data point into myArray
            myArray.push(docs[i]);
            console.log(myArray[i]);
        }

/*
		
        //Express: Renders the Index EJS file in Views folder
        app.get('/', function (req, res) {
            //Passes data values from Mongo over to EJS file to be rendered
            res.render('Index', { ID: myArray[0]._id, Name: myArray[0].Name, Author: myArray[0].Author, Category: myArray[0].Category});
        });

*/
        app.listen(8080);
        console.log('8080 is the magic port');

    });
    client.close();
});

