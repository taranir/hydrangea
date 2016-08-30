var express = require('express');
var router = express.Router();
var firebase = require('firebase');

module.exports = function(firebaseRef) {
	/* GET home page. */
	router.get('/', function(req, res, next) {
		res.sendFile("/index.html");
	});

	router.get('/test', function(req, res, next) {
		console.log("al;sdjflkajs");

		var testRef = firebaseRef.ref().child("test").push({
			test: new Date().toISOString()
		});

		res.sendStatus(200);
	});

	return router;
}