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
            var data = {
                error: null,
                message: 'Track added to queue',
                inQueue: true
            };
			if (player.isPlayingTrack()) {
				player.addTrackToQueue(streamUrl);
			} else {
                data.message = 'Playing song now';
                data.inQueue = false;
                // fire and forget type call
				player.playTrackStream(streamUrl);
			}
            res.json(data);
			res.end();
		})
		.catch(function (err) {
			console.log(err);

            data.error = JSON.stringify(err);
            data.message = 'An error occurred';
            data.inQueue = false;

			res.json(data);
		});
});

module.exports = router;
