var express = require('express');
var http = require('http');
var Promise = require('lie');

var player;

var router = express.Router();

router.get('/connect', function (req, res) {
    res.json({
        connectionString: req.headers.host
    });
    res.end();
});

module.exports = function (io) {
    player = require('./player')(io);
    return router;
};
