'use strict';

const http = require('http');
const fs = require('fs');
const express = require('express');

const app = express();
console.log(typeof app); // should return function
// app.use(express.static('www')); // configure function object


const widgets = [
    { id: 1, name: 'Widget 1', color: 'blue'},
    { id: 2, name: 'Widget 2', color: 'pink'},
    { id: 3, name: 'Widget 3', color: 'purple'},
]

const new_widget = {
    name: 'My widget',
    color: 'blue'
}

app.post('/api/widgets/:widgetId', function(req, res) {
    try {
        new_widget.id = req.params.widgetId;
        widgets.push(new_widget);
        res.json(widgets);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.delete('/api/widgets', function(req, res) {
    try {
        widgets.pop();
        res.json(widgets);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.get('/api/widgets/:widgetId', function(req, res) {
    try {
        res.json(widgets.find(w => w.id === parseInt(req.params.widgetId, 10)));
    } catch (err) {
        res.status(500).send(err.message);
    }
    
})

// get: only run for GET requests.
app.get('/api/widgets', function(req, res) {
    try {
        res.json(widgets);
    } catch (err) {
        res.status(500).send(err.message);
    }
    
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

