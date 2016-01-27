(function () {
    "use strict";

    var express = require('express');
    var path = require('path');
    var http = require('http');
    var socketIO = require('socket.io');
    var bodyParser = require('body-parser');
    
    // bring in the player and other dependencies
    var api = require('./lib/api');
    var db = require('./lib/speakerDb');
    var roomHandler = require('./lib/roomHandler');

    // Initialize Express Server
    var app = express();

    // Configure Express server
    app.use(bodyParser.json());
    
    // Initialize database connection
    db.init().then(function () {
        console.log("Database connection established!");
    }, onError);

    // setup static routes
    app.use(express.static(path.join(__dirname, '/node_modules')));
    app.use(express.static(path.join(__dirname, '/dist')));
    app.use(express.static(path.join(__dirname, '/public')));
    app.use('/api', api);

    // Main route to load app
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '/index.html'));
    });

    // Setup SocketIO with Express
    var server = http.Server(app);
    var io = socketIO(server);
    
    // This is fired whenever a connection is made
    io.on('connection', function (socket) {
        console.log('Client Connected!');
        
        // Apply player message handlers
        socket.on('play-song', roomHandler.playTrack.bind(this, socket));
        socket.on('add-song', roomHandler.addTrack.bind(this, socket));
        socket.on('refresh', roomHandler.refreshTrack.bind(this, socket));
        socket.on('time-update', roomHandler.updateTrackTime.bind(this, socket));
        
        socket.on('join-room', function (roomName) {
            socket.join(roomName, function (err) {
                if (err) {
                    return console.error('Failed to join room', JSON.stringify(err)); 
                }
                console.log('Client joined the ' + roomName + ' room');
                // Fetch state of default speaker room
                db.getOrCreateRoom(roomName).then(function (room) {
                    console.log('Send ', room, ' room-state to client');
                    socket.emit('room-state', room);
                }, onError);
            });
        });

        // register events
        socket.on('disconnect', function () {
            console.log('Client has disconnected');
        });
    });
    
    function onError(err) {
        console.error(JSON.stringify(err));
    }

    // Public properties
    module.exports = {
        server: server,
        io: io
    };

}());