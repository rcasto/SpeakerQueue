var Promise = require('lie');

var io;

var Request = require('./util/http');
var config = require('../config.json');

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
        artist: track.user.username
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
					reject(err);
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
                if (isPlaying) {
                    queue.push(track);
                } else {
                    io.to('speakerQueue').emit('play-song', track);
                }
            }, function (err) {
                console.error(err);
            });
        });

        socket.on('play-song', function (track) {
            currentTrack = track;
            isPlaying = true;
        });

        // send current state of queue and player upon connection
        socket.emit('queue-state', {
            tracks: queue,
            currentTrack: currentTrack
        });

    });

    return {
        getTrackLocation: getTrackLocation,
        getCurrentTrack: getCurrentTrack,
        addTrackToQueue: addTrackToQueue,
        getQueue: getQueue
    };
};
