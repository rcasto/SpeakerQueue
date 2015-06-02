var http = require('http');
var https = require('https');
var url = require('url');
var Promise = require('lie');

var isPlaying = false;
var client_id = '9cb398fe220f1bef54d28cc3f4a8a06a';

function loadTrack(track) {
	return new Promise(function (resolve, reject) {
		var streamUrl = track["stream_url"], protocol, trackData;
		if (streamUrl) {
			streamUrl = url.parse(streamUrl + "?client_id=" + client_id + "&allow_redirects=False");
			protocol = streamUrl.protocol === "https:" ? https : http;
			trackData = '';

			protocol.get(streamUrl, function (response) {
				response.on('data', function (chunk) {
					trackData += chunk;
				});
				response.on('end', function () {
					try {
						trackData = JSON.parse(trackData);
						if (trackData.location) {
							resolve(trackData.location);
						} else {
							reject("No location returned for stream of track: " + JSON.stringify(track));
						}
					} catch (err) {
						reject(err);
					}
				});
				response.setEncoding('utf8');
			});
		} else {
			reject("No valid stream for track: " + JSON.stringify(track));
		}
	});
}

function playTrack(streamUrl) {
	return new Promise(function (resolve, reject) {
		

		
		reject("Failed to play: " + JSON.stringify(streamUrl));
	});
}

function isPlayingTrack() {
	return isPlaying;
}

module.exports = {
	loadTrack: loadTrack,
	playTrack: playTrack,
	isPlayingTrack: isPlayingTrack
};