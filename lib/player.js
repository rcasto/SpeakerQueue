(function () {
    "use strict";

    var Promise = require('lie');

    var io;

    var Request = require('./util/http');
    // var config = require('../config.json');

    var isPlaying = false;
    var currentTrack = null;
    var queue = [];

    // normalize track object
    function getTrackInfo(track) {
        return {
            id: track.id,
            title: track.title,
            description: track.description,
            stream_url: track.stream_url,
            artwork_url: track.artwork_url,
            artist: track.user.username,
            stream_location: track.stream_location
        };
    }

    function getTrackLocation(track) {
        return new Promise(function (resolve, reject) {
            if (track.stream_url) {
                Request.getJSON(track.stream_url + "?client_id=" + config.clientId + "&allow_redirects=False")
                    .then(function (data) {
                        if (data.location) {
                            resolve(data.location);
                        } else {
                            reject("No location returned for stream of track: " + JSON.stringify(data));
                        }
                    }, function (error) {
                        reject(error);
                    });
            } else {
                reject("No validstream for track: " + JSON.stringify(track));
            }
        });
    }

    function getQueue() {
        return queue;
    }

    function addTrackToQueue(track) {
        console.log(track.title + " added to queue");
        queue.push(track);
    }

    function getCurrentTrack() {
        return currentTrack;
    }

    function messageRoom(eventName, data) {
        console.log('Messaging room: ' + eventName);
        /* jshint validthis:true */
        this.to('speakerQueue').emit(eventName, data);
    }

    // define exports
    module.exports = function (_io_) {
        io = _io_;

        io.on('connection', function (socket) {

            socket.on('add-song', function (track) {
                track = getTrackInfo(track);
                getTrackLocation(track).then(function (location) {
                    track.stream_location = location;
                    queue.push(track);
                }, function (err) {
                    console.error(err);
                });
            });

            socket.on('play-song', function (track) {
                currentTrack = getTrackInfo(track);
                if (!currentTrack.stream_location) {
                    getTrackLocation(track).then(function (location) {
                        currentTrack.stream_location = location;
                        isPlaying = true;
                        io.to('speakerQueue').emit('play-song', currentTrack);
                    }, function (err) {
                        console.error(err);
                    });
                } else {
                    isPlaying = true;
                    io.to('speakerQueue').emit('play-song', currentTrack);
                }
            });

            // send current state of queue and player upon connection
            socket.emit('queue-state', {
                tracks: queue,
                currentTrack: currentTrack,
                isPlaying: isPlaying
            });

        });

        return {
            getTrackLocation: getTrackLocation,
            getCurrentTrack: getCurrentTrack,
            addTrackToQueue: addTrackToQueue,
            getQueue: getQueue
        };
    };
}());
