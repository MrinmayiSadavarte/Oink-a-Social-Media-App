// Server side app - backend

var express = require('express');
var app = express();

app.use(express.static('public')); // public is the folder containing front-end stuff


// Created an API for connecting backend to frontend
app.get('/posts', function(req, res, next){
	var posts = [
		'Hello',
		'Wassup',
		'How are you',
		'Goodbye',
		'Hello again'
	];
	res.send(posts);
})

app.listen(3000, function () { // 3000 is the port number on which server is listening
	console.log('Example app listening on port 3000!');
});