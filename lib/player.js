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
		var streamUrl = track["stream_url"], protocol, trackData;
		if (streamUrl) {
			Request.getJSON(streamUrl + "?client_id=" + config.clientId + "&allow_redirects=False")
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

function playTrackStream(streamUrl) {
	console.log("getting track url for: " + streamUrl);

	Request.get(streamUrl).then(function (response) {
		response
			.pipe(new lame.Decoder())
			.on('format', function (format) {
				isPlaying = true;
				this.pipe(new Speaker(format));
			})
			.on('error', function (err) {
				console.log(err);
			})
			.on('end', function () {
				console.log("track stream " + streamUrl + " has ended");
				// play the next song if there is one
				if (queue.length > 0) {
					playTrackStream(queue.shift());
				} else {
					isPlaying = false;
				}
			});
	});
}

function addTrackToQueue(trackUrl) {
	queue.push(trackUrl);
}

function isPlayingTrack() {
	return isPlaying;
}

// define exports
module.exports = {
	loadTrack: loadTrack,
	playTrackStream: playTrackStream,
	isPlayingTrack: isPlayingTrack,
	addTrackToQueue: addTrackToQueue
};