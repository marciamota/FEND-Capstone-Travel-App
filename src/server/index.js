const dotenv = require('dotenv');
dotenv.config();

const apiURL = 'http://api.openweathermap.org/data/2.5/weather?units=imperial'
const apiKey = process.env.API_KEY

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

// app.post('/sentiment', async function(req, res) {
//     urlInput = req.body.url;
//     const requestURL = `${apiURL}key=${apiKey}&url=${urlInput}&lang=en`;
//     fetch(requestURL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' }
//     }).then(response => {
//         return response.json()
//     }).then(json => { 
//         res.send(json)
//     }).catch(err => {
//         res.send({error: err})
//     });
// })

app.listen(8081, function () {
    console.log('Travel app listening on port 8081!');
})

// Setup empty JS object to act as endpoint for all routes
projectData = {};

// HTTP GET
app.get('/all', (request, response) => {
    response.send(projectData);
    console.log(projectData);
});

// HTTP POST
app.post('/add', function(request, response) {
    projectData = {
        temp: request.body.temp,
        date: request.body.date,
        content: request.body.content,
    }
    console.log(projectData);
    response.send(projectData)
});
