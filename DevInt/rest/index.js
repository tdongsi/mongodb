'use strict';

const http = require('http');
const fs = require('fs');
const express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

const app = express();
// console.log(typeof app); // should return function
// app.use(express.static('www')); // configure function object
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


const widgets = [
    { id: 1, name: 'Widget 1', color: 'blue'},
    { id: 2, name: 'Widget 2', color: 'pink'},
    { id: 3, name: 'Widget 3', color: 'purple'},
]

const new_widget = {
    name: 'My widget',
    color: 'blue'
}

let lastId = 0;


// ES6: Destructuring
const {MongoClient} = require('mongodb');
// Connection URL 
var url = 'mongodb://localhost:27017/restapp';
// Use connect method to connect to the Server 

const mongo = new Promise( function(resolve, reject) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            reject(err);
            return;
        }

        console.log("Connected correctly to server");
        resolve(db);
    });
});


// POST method: add an item
app.post('/api/widgets', upload.array(), function(req, res) {

    mongo.then(function(db) {
        console.log(req.body);
        var temp = req.body;
        temp.id = ++lastId;
        db.collection('widgets').insertOne(temp, function(err, result) {
            if (err) {
                res.status(500).send(err.message);
            }

            console.log("Insert an item");
            res.status(200).send("Success");
        });
        
    }).catch(function(err) {
        res.status(500).send(err.message);
    });

})


// DELETE method
app.delete('/api/widgets', function(req, res) {
    mongo.then(function(db) {
        const collection = db.collection('widgets');
        collection.drop();
        res.status(500).send("Delete complete");
    }).catch(function(err) {
        res.status(500).send(err.message);
    });
})

// GET an item
app.get('/api/widgets/:widgetId', function(req, res) {
    mongo.then(function(db) {
        db.collection('widgets').findOne({"id": parseInt(req.params.widgetId, 10)}, (err, data) => {
            if (err) {
                res.status(500).send(err.message);
            }

            res.json(data);
        })
    }).catch(function(err) {
        res.status(500).send(err.message);
    });
    
})

// get: only run for GET requests.
app.get('/api/widgets', function(req, res) {

    mongo.then(function(db) {
        // get data from db
        const collection = db.collection('widgets');
        collection.find({}).toArray((err, data) => {
            if (err) {
                res.status(500).send(err.message);
            }

            res.json(data);
        });
    }).catch( function(err) {
        res.status(500).send(err.message);
    });
    
})

// use: it will run for all requests.
app.use("/duy", function(req, res, next) {
    console.log("duy is cool");

    // Use property to pass data to next function
    req.passdata = "New data"

    next();
})

app.use(function(req, res) {
    console.log(req.url);
    console.log(req.passdata);

    fs.readFile('www/index.html', 'utf8', (err, data) => {
        if (err) {
            res.send("error");
            return;
        }
        res.send(data);
    });
});

const server = http.createServer(app);

server.listen(3000, function() {
    console.log("listening on port 3000");
});

