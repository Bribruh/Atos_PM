const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/BookstoreDb';

// Database Name
const dbName = 'BookstoreDb';

// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    var collection = db.collection('Books');

    var myArray = [];

    //var myArray = collection.find().toArray(function (err, items) { });
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);

        for (var i = 0; i < docs.length; i++) {
            myArray.push(docs[i]);
            console.log(myArray[i]);
            console.log("I've stored you!");
        }

        //for (var i = 0; i < myArray.length; i++) {
            //console.log("Name of " + i + ": " +myArray[i].Name);
        //}

    });
    client.close();
});

