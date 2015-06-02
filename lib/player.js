var http = require('http');
var https = require('https');
var url = require('url');
var Promise = require('lie');
var Player = require('player');

var player = new Player([]);
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

function addTrack(streamUrl) {
	player.add(streamUrl);
}

function playTrack(streamUrl) {
	return new Promise(function (resolve, reject) {
		player.play(function (err, player) {
			if (err) {
				reject(err);
			} else {
				resolve(player);
			}
		});
	});
}

function numTracks() {
	return player.list.length;
}

function isPlayingTrack() {
	return isPlaying;
}

function play() {
	if (!isPlaying && player.list.length > 0) {
		isPlaying = true;
		player.play();
	}
}

function stop() {
	if (isPlaying) {
		isPlaying = false;
		player.stop();
	}
}

// add event listeners
player.on('playing', function (track) {
	console.log("playing: " + JSON.stringify(track));
});
player.on('playend', function (track) {
	console.log("done playing: " + JSON.stringify(track));
	player.next();
});
player.on('error', function (err) {
	console.log("player error: " + JSON.stringify(err));
});

// define exports
module.exports = {
	loadTrack: loadTrack,
	addTrack: addTrack,
	playTrack: playTrack,
	play: play,
	stop: stop,
	isPlayingTrack: isPlayingTrack,
	numTracks: numTracks
};