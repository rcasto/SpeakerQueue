var express = require('express');
var http = require('http');
var Promise = require('lie');

var player = require('./player');

var router = express.Router();

// normalize track object
function getTrackInfo(track) {
    return {
        id: track.id,
        title: track.title,
        description: track.description,
        stream_url: track.stream_url,
        artwork_url: track.artwork_url,
        artist: track.user.username
    };
}

router.get('/queue', function (req, res) {
    res.json(player.getQueue());
    res.end();
});

router.post('/queue', function (req, res) {
    var track = getTrackInfo(req.body);
	player.loadTrack(track)
		.then(function (streamUrl) {
            var data = {
                error: null,
                message: 'Track added to queue',
                inQueue: true,
                trackInfo: track
            };
            track.stream_location = streamUrl;
			if (player.isPlayingTrack()) {
				player.addTrackToQueue(track);
			} else {
                data.message = 'Playing song now';
                data.inQueue = false;
                // fire and forget type call
				player.playTrack(track);
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
