// Server side app - backend

var express = require('express');
var app = express();

app.use(express.static('public')); // public is the folder containing front-end stuff

app.listen(3000, function () { // 3000 is the port number on which server is listening
	console.log('Example app listening on port 3000!');
});