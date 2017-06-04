// Server side app - backend

var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var app = express();
var db = null;

/* 'oink' is the database, 27017 is the default port, 'connect' is the function: 1st argument is
connection string, 2nd argument is callback function consisting of task after connected */
MongoClient.connect("mongodb://localhost:27017/oink", function(err, dbconn) {
  if(!err) {
    console.log("We are connected");
    db = dbconn;
  }
});


app.use(bodyParser.json());

app.use(express.static('public')); // public is the folder containing front-end stuff

// Created an API for connecting backend to frontend
// req : contains request object, res : response object to send data back, next : errors like database error etc.

app.get('/posts', function(req, res, next){
	
	db.collection('posts', function(err, postsCollection) {
		postsCollection.find().toArray(function(err, posts) {
			return res.json(posts); // use res.json here instead of res.send
		});
	});
});

// stores the data on the server, handles post request from frontend
// Syntax: post(url, data, [config])

app.post('/posts', function(req, res, next) {

	db.collection('posts', function(err, postsCollection) {

		var newPost = {
			text: req.body.newPost
		};

		/* Arguments - 1st : object (created in the above line), 2nd : options always {w:1} i.e {write mode : 1},
		3rd : callback function */
		postsCollection.insert(newPost, {w:1}, function(err, posts) {
			return res.send(); // use res.send here instead of res.json // this is important else the server can hang
		});
	});
});


app.put('/posts/remove', function(req, res, next) {

	db.collection('posts', function(err, postsCollection) {

		var postId = req.body.post._id;
		postsCollection.remove({_id: ObjectId(postId)}, {w:1}, function(err, posts) {
			return res.send(); // use res.send here instead of res.json // this is important else the server can hang
		});
	});
});



// Creating and encrypting a new user in the database

app.post('/users', function(req, res, next) {

	db.collection('users', function(err, usersCollection) {

		bcrypt.genSalt(10, function(err, salt) {
    		bcrypt.hash(req.body.password, salt, function(err, hash) {

        		var newUser = {
					username: req.body.username,
					password: hash
				};

				usersCollection.insert(newUser, {w:1}, function(err) {
					return res.send(); // use res.send here instead of res.json // this is important else the server can hang
				});
    		});
		});	
	});
});


// Decrypting and comparing username and password using bcryptjs

app.put('/users/signin', function(req, res, next) {

	db.collection('users', function(err, usersCollection) {

		usersCollection.findOne({username: req.body.username}, function(err, user) {
			
			// Comparing both passwords:
			// 1st argument: User's attempted password, 2nd : Hashed password, 3rd : Call-back function

			bcrypt.compare(req.body.password, user.password, function(err, result) {
				if (result) {
					return res.send();
				} else {
					return res.status(400).send();   // Error 400 : passwords do not match
				}
			});			
		});
	});
});



app.listen(3000, function () { // 3000 is the port number on which server is listening
	console.log('Example app listening on port 3000!');
});