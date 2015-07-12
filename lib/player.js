var lame = require('lame');
var Promise = require('lie');
var Speaker = require('speaker');

var Request = require('./util/http');
var config = require('../config.json');

var isPlaying = false;
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

function loadTrack(track) {
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

function playTrack(track) {
	console.log("playing " + track.title);

	Request.get(track.stream_location).then(function (response) {
        isPlaying = true;

		response
			.pipe(new lame.Decoder())
			.on('format', function (format) {
				this.pipe(new Speaker(format))
                    .on('error', function (err) {
                        console.log(err);
                        this.end();
                    });
			})
			.on('error', function (err) {
				console.log(err);
                this.end();
			})
			.on('end', function () {
				console.log(track.title + " has ended");
				// play the next song if there is one
				if (queue.length > 0) {
					return playTrack(queue.shift());
				} else {
					isPlaying = false;
				}
			});
	});
}

function getQueue() {
    return queue;
}

function addTrackToQueue(track) {
    console.log(track.title + " added to queue");
	queue.push(track);
}

function isPlayingTrack() {
	return isPlaying;
}

function messageRoom(eventName, data) {
    console.log('Messaging room: ' + eventName);
    this.to('speakerQueue').emit(eventName, data);
}

// define exports
module.exports = function (io) {
    io.on('connection', function (socket) {

        socket.on('add-song', function (track) {
            track = getTrackInfo(track);
            loadTrack(track).then(function (location) {
                track.stream_location = location;
                if (isPlayingTrack() || queue.length > 0) {
                    addTrackToQueue(track);
                    messageRoom.call(io, 'add-song', track);
                } else {
                    playTrack(track);
                }
            }, function (err) {
                console.error(err);
            });
        });

        socket.emit('queue-state', queue);

    });

    return {
        loadTrack: loadTrack,
        playTrack: playTrack,
        isPlayingTrack: isPlayingTrack,
        addTrackToQueue: addTrackToQueue,
        getQueue: getQueue
    };
};
