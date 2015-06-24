var lame = require('lame');
var Promise = require('lie');
var Speaker = require('speaker');

var Request = require('./util/http');
var config = require('../config.json');

var isPlaying = false;
var queue = [];

function loadTrack(track) {
	console.log('loading track: ' + track);

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
			reject("No valid stream for track: " + JSON.stringify(track));
		}
	});
}

function playTrack(track) {
	console.log("play stream url: " + track);

	Request.get(track.stream_location).then(function (response) {
        isPlaying = true;

		response
			.pipe(new lame.Decoder())
			.on('format', function (format) {
				this.pipe(new Speaker(format));
			})
			.on('error', function (err) {
				console.log(err);
			})
			.on('end', function () {
				console.log("track stream " + track + " has ended");
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
	queue.push(track);
}

function isPlayingTrack() {
	return isPlaying;
}

// define exports
module.exports = {
	loadTrack: loadTrack,
	playTrack: playTrack,
	isPlayingTrack: isPlayingTrack,
	addTrackToQueue: addTrackToQueue,
    getQueue: getQueue
};
