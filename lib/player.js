var http = require('http');
var https = require('https');
var url = require('url');
var path = require('path');
var lame = require('lame');
var Promise = require('lie');
var Speaker = require('speaker');

var isPlaying = false;
var client_id = '9cb398fe220f1bef54d28cc3f4a8a06a';

function get(uri) {
	return new Promise(function (resolve, reject) {
		var urlObj = url.parse(uri, true);
		var protocol = urlObj.protocol === "https:" ? https : http;
		var data = '';
		protocol.get(uri, function (response) {
			resolve(response);
		});
	});
}

function getJSON(uri) {
	return new Promise(function (resolve, reject) {
		get(uri).then(function (response) {
			var data = '';
			response.on('data', function (chunk) {
				data += chunk;
			});
			response.on('end', function () {
				try {
					resolve(JSON.parse(data));
				} catch (err) {
					reject(err);
				}
			});
			response.on('error', function (err) {
				reject(err);
			});
			response.setEncoding('utf8');
		});
	});
}

function getBinary(uri) {
	return new Promise(function (resolve, reject) {
		get(uri).then(function (response) {
			var data = [];
			response.on('data', function (chunk) {
				data.push(new Buffer(chunk));
			});
			response.on('end', function () {
				var buffer = Buffer.concat(data);
	        	resolve(buffer);
			});
			response.on('error', function (err) {
				reject(err);
			});
			response.setEncoding('binary');
		});
	});
}

function loadTrack(track) {
	return new Promise(function (resolve, reject) {
		var streamUrl = track["stream_url"], protocol, trackData;
		if (streamUrl) {
			getJSON(streamUrl + "?client_id=" + client_id + "&allow_redirects=False")
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

function streamTrack(streamUrl) {
	// getBinary(streamUrl).then(function (trackBuffer) {
	// 	console.log(data);
	// }, function (error) {
	// 	console.error(JSON.stringify(error));
	// });

	get(uri).then(function (response) {
		response
			.pipe(new lame.Decoder())
			.on('format', function (format) {
				console.log("Format: " + format);
				this.pipe(new Speaker(format));
			});

		response.on('error', function (err) {
			console.log("Error reading soundcloud stream url");
			console.error(err.stack);
		});

		response.setEncoding('base64');
	});
}

// define exports
module.exports = {
	loadTrack: loadTrack,
	streamTrack: streamTrack
};