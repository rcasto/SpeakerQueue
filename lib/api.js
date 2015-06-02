var express = require('express');
var http = require('http');
var Promise = require('lie');

var queue = require('./queue');
var player = require('./player');

var router = express.Router();

router.get('/queue', function (req, res) {
});

router.post('/queue', function (req, res) {
	player.loadTrack(req.body)
		.then(function (trackUrl) {
			player.addTrack(trackUrl);
			if (!player.isPlayingTrack()) {
				player.play();
			}
			res.json(trackUrl);
			res.end();
		})
		.catch(function (err) {
			console.error(err);
			res.json({
				error: JSON.stringify(err),
				message: "Error loading track"
			});
			res.end();
		});
});

module.exports = router;