var express = require('express');
var http = require('http');
var Promise = require('lie');

var player = require('./player');

var router = express.Router();

router.get('/queue', function (req, res) {
});

router.post('/queue', function (req, res) {
	player.loadTrack(req.body)
		.then(function (streamUrl) {
			if (player.isPlayingTrack()) {
				player.addTrackToQueue(streamUrl);
				res.json({
					error: null,
					message: "Track added to queue"
				});
			} else {
				player.playTrackStream(streamUrl);
			}
			res.end();
		})
		.catch(function (err) {
			console.log(err);
			res.json({
				error: JSON.stringify(err),
				message: "Error loading track"
			});
		});
});

module.exports = router;