// Server side app - backend

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.use(express.static('public')); // public is the folder containing front-end stuff

var posts = [
	'Hello',
	'Wassup',
	'How are you',
	'Goodbye',
	'Hello again'
];

// Created an API for connecting backend to frontend
// req : contains request object, res : response object to send data back, next : errors like database error etc.
app.get('/posts', function(req, res, next){
	res.send(posts);
});

// stores the data on the server, handles post request from frontend
// Syntax: post(url, data, [config])
app.post('/posts', function(req, res, next) {
	posts.push(req.body.newPost);
	res.send(); // this is important else the server can hang
});

app.listen(3000, function () { // 3000 is the port number on which server is listening
	console.log('Example app listening on port 3000!');
});