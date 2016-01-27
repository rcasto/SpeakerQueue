(function () {
    "use strict";

    var express = require('express');
    var fs = require('fs');
    var path = require('path');
    var ntpClient = require('ntp-client');
    
    var db = require('./speakerDb');
    
    var router = express.Router();

    router.get('/connect', function (req, res) {
        var connectionString = req.headers.host;
        console.log("Connection String:", connectionString);
        res.json({
            connectionString: connectionString
        });
        res.end();
    });
    
    router.get('/config', function (req, res) {
        console.log('config file requested by a client:', req.headers["user-agent"]);

        fs.readFile(path.join(__dirname, '../config.json'), function (err, data) {
            if (err) {
                console.error(JSON.stringify(err));
            }
            res.json(JSON.parse(data));
        });
    });
    
    router.get('/time', function (req, res) {
        console.log('getting server time');
        ntpClient.getNetworkTime("us.pool.ntp.org", 0, function (err, date) {
            if (err) {
                console.error(err);
                return;
            }
            console.log(date);
            res.json(date);
        });
    });
    
    router.get('/rooms/:roomId?', function (req, res) {
        console.log('client is getting rooms:', req.params.roomId);
        
        if (req.params.roomId) {
            db.getOrCreateRoom(req.params.roomId).then(function (room) {
                res.json(room);
            }, function (err) {
                res.json({
                    error: "Something went wrong"
                });
            });
        } else {
            db.getAllRooms().then(function (rooms) {
                res.json(rooms);
            }, function (err) {
                res.json({
                    error: "Something went wrong"
                });
            });
        }
    });

    module.exports = router;
}());
