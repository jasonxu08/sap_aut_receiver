var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

const serverPort = 3000;
var dataStorage = require("./data_storage");

app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());

dataStorage.initData();


var server = app.listen(serverPort, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
 });

app.post('/postAUT', function (req, res) {
    dataStorage.processInput(req.body);
    res.end("postAUT received. " + req.body);
 });

 app.get('/getAllAUT', function(req, res) {
    res.end(JSON.stringify(dataStorage.autData));
 });

 app.get('/getAUTsByType', function(req, res) {
   var auts = dataStorage.getAUTsByTypeInJSON(req.query["type"]);
   res.end(JSON.stringify(auts));
 });