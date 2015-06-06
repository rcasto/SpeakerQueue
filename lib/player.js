var lame = require('lame');
var Promise = require('lie');
var Speaker = require('speaker');

var Request = require('./util/http');
var config = require('../config.json');

var isPlaying = false;

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

	return new Promise(function (resolve, reject) {
		Request.get(streamUrl).then(function (response) {
			response
				.pipe(new lame.Decoder())
				.on('format', function (format) {
					console.log('format: ' + format);
					this.pipe(new Speaker(format));
				})
		}, function (err) {
			reject(err);
		});
	});
}

// define exports
module.exports = {
	loadTrack: loadTrack,
	playTrackStream: playTrackStream
};