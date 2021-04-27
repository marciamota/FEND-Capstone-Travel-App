var path = require('path')
const express = require('express')
var cors = require('cors')
const fetch = require('node-fetch');

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.use(express.static('dist'))

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// Setup empty JS object to act as endpoint for all routes
var projectData = {};

// HTTP GET
app.get('/all', (request, response) => {
    response.send(projectData);
    console.log(projectData);
});

// HTTP POST
app.post('/add', function(request, response) {
    projectData = request.body;
    console.log(projectData);
    response.send(projectData)
});

module.exports = app;