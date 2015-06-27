var express = require('express');
var path = require('path');
var http = require('http');
var socketIO = require('socket.io');
var bodyParser = require('body-parser');

var api = require('./lib/api');

var app = express();

app.use(bodyParser.json());

// setup static routes
app.use(express.static(path.join(__dirname + '/node_modules')));
app.use(express.static(path.join(__dirname + '/public')));

app.use('/api', api);

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

var server = http.Server(app);
var io = socketIO(server);

module.exports = {
    server: server,
    io: io
};
