var express = require('express');
var http = require('http');
var Promise = require('lie');

var queue = require('./queue');
var player = require('./player');

var router = express.Router();

router.get('/queue', function (req, res) {
});

router.post('/queue', function (req, res) {
	if (player.isPlayingTrack()) {
		queue.addTrack(req.body);
	} else { // play the song
		player.loadTrack(req.body)
			.then(player.playTrack)
			.then(function (trackData) {
				res.json(trackData);
				res.end();
			}).catch(function (err) {
				console.error(err);
				res.json({
					error: JSON.stringify(err),
					message: "Error loading track"
				});
				res.end();
			});
	}
});

module.exports = router;