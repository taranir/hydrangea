var express = require('express');
var router = express.Router();
var firebase = require('firebase');

var sendSuccess = function(res, content) {
  res.status(200).json({
    success: true,
    content: content
  }).end();
};

var sendErrResponse = function(res, err) {
  res.status(400).json({
    success: false,
    err: err
  }).end();
};

module.exports = function(firebaseDbRef) {
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.sendFile("/index.html");
  });



  router.get('/test', function(req, res, next) {
    console.log("al;sdjflkajs");

    var testRef = firebaseDbRef.ref().child("test").push({
      test: new Date().toISOString()
    });

    sendSuccess(res, null);
  });

  // router.post('/check', function(req, res) {
 //    if (req.user != null) {
 //      sendSuccess(res, req.user);
 //      return;
 //    }
 //    sendSuccess(res, null);
 //  });

  return router;
}