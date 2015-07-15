var lame = require('lame');
var Promise = require('lie');
var Speaker = require('speaker');

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
        currentTrack = track;

        messageRoom.call(io, 'play-song', track);

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
                messageRoom.call(io, 'end-song', track);
				console.log(track.title + " has ended");

                var nextTrack = queue.shift();

				// play the next song if there is one
				if (nextTrack) {
                    messageRoom.call(io, 'remove-song', nextTrack);
					process.nextTick(function () {
                        playTrack(nextTrack);
                    });
				} else {
					isPlaying = false;
                    currentTrack = null;
				}
			});
	}, function (error) {
        console.error(error);
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
            loadTrack(track).then(function (location) {
                track.stream_location = location;
                if (isPlayingTrack() || queue.length > 0) {
                    addTrackToQueue(track);
                    messageRoom.call(io, 'add-song', track);
                } else {
                    process.nextTick(function () {
                        playTrack(track);
                    });
                }
            }, function (err) {
                console.error(err);
            });
        });

        socket.emit('queue-state', {
            tracks: queue,
            currentTrack: currentTrack
        });

    });

    return {
        loadTrack: loadTrack,
        playTrack: playTrack,
        isPlayingTrack: isPlayingTrack,
        getCurrentTrack: getCurrentTrack,
        addTrackToQueue: addTrackToQueue,
        getQueue: getQueue
    };
};
