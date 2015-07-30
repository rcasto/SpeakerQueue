/* global require */
/* global __dirname */
/* global module */

(function () {
    "use strict";

    var express = require('express');
    var path = require('path');
    var http = require('http');
    var socketIO = require('socket.io');
    var bodyParser = require('body-parser');

    var app = express();

    app.use(bodyParser.json());

    // setup static routes
    app.use(express.static(path.join(__dirname + '/node_modules')));
    app.use(express.static(path.join(__dirname + '/public')));

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname + '/index.html'));
    });

    var server = http.Server(app);
    var io = socketIO(server);

    var api = require('./lib/api');

    // bring in the player and its dependencies
    require('./lib/player')(io);

    // setup other routes
    app.use('/api', api);

    module.exports = {
        server: server,
        io: io
    };

}());
