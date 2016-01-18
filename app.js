(function () {
    "use strict";

    var express = require('express');
    var path = require('path');
    var http = require('http');
    var socketIO = require('socket.io');
    var bodyParser = require('body-parser');
    
    var DEFAULT_ROOM = 'default';
    
    // bring in the player and other dependencies
    var Player = require('./lib/player');
    var api = require('./lib/api');
    var db = require('./lib/speakerDb');

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
        socket.on('play-song', function (track) {
            if (!Player.isPlayingTrack() || !Player.compareTracks(Player.getCurrentTrack(), track)) {
                playSong(track);
            }
        });
        
        socket.on('select-song', function (track) {
            if (track.refresh) {
                console.log("Track refresh");
                
                track.refresh = false;
                track.stream_location = null;
                Player.setPlayStatus(false);
            }
            if (!track.stream_location) {
                Player.getTrackLocation(track).then(songSelected.bind(null, socket), onError);
            } else {
                songSelected(socket, track);
            }
        });
        
        socket.on('join-room', function (room) {
            socket.join(room, function (err) {
                if (err) {
                    return console.error('Failed to join room', JSON.stringify(err)); 
                }
                console.log('Client joined the ' + room + ' room');
                // Fetch state of default speaker room
                db.getRooms(room).then(function (room) {
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
    
    // Private Utility functions
    function songSelected(socket, track) {
        // Will have to fetch room state and then make these checks
        if (Player.isPlayingTrack()) {
            Player.addTrackToQueue(track);
            io.to(getSocketRoom(socket)).emit('add-song', track);
        } else {
            playSong(socket, track);
        }
    }
    
    function playSong(socket, track) {
        Player.setCurrentTrack(track);
        io.to(getSocketRoom(socket)).emit('play-song', track);
        Player.setPlayStatus(!Player.isPlayingTrack());
    }
    
    // Assume people are only in room at a time
    function getSocketRoom(socket) {
        if (socket && socket.rooms) {
            var rooms = Object.keys(socket.rooms);
            if (rooms.length >= 2) {
                return rooms[1];   
            }
        }
        return null;
    }
    
    function onError(err) {
        console.error(JSON.stringify(err));
    }

    // Public properties
    module.exports = {
        server: server,
        io: io
    };

}());