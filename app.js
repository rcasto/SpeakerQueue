(function () {
    "use strict";

    var express = require('express');
    var path = require('path');
    var http = require('http');
    var socketIO = require('socket.io');
    var bodyParser = require('body-parser');
    
    // bring in the player and its dependencies
    var Player = require('./lib/player');
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

    // Setup SocketIO with Express
    var server = http.Server(app);
    var io = socketIO(server);
    
    // This is fired whenever a connection is made
    io.on('connection', function (socket) {
        console.log('Client Connected! - Joining SpeakerQueue Room');
        
        // join message room
        socket.join('speakerQueue', function (err) {
            if (err) { 
                console.error('Failed to join room', JSON.stringify(err)); 
            } else {
                console.log('Send queue-state to client');
                socket.emit('queue-state', {
                    tracks: Player.getQueue(),
                    currentTrack: Player.getCurrentTrack()
                });   
            }
        });
        
        // Apply player message handlers
        socket.on('select-song', function (track) {
            if (!track.stream_location) {
                Player.getTrackLocation(track).then(songSelected, onError);
            } else {
                songSelected(track);
            }
        });

        // register events
        socket.on('disconnect', function () {
            console.log('Client has disconnected');
        });
    });
    
    function songSelected(track) {
        if (Player.isPlayingTrack()) {
            Player.addTrackToQueue(track);
             io.to('speakerQueue').emit('add-song', track);
        } else {
            Player.setCurrentTrack(track);
            io.to('speakerQueue').emit('play-song', track);
        }
    }
    
    function onError(err) {
        console.error(JSON.stringify(err));
    }

    module.exports = {
        server: server,
        io: io
    };

}());