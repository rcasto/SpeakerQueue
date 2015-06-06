var http = require('http');
var https = require('https');
var url = require('url');
var Promise = require('lie');

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
	console.log("get JSON from: " + uri);

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

module.exports = {
	get: get,
	getBinary: getBinary,
	getJSON: getJSON
};