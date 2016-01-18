(function () {
    "use strict";

    var express = require('express');
    var fs = require('fs');
    var path = require('path');
    
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
    
    router.get('/rooms/:roomId?', function (req, res) {
        console.log('client is getting rooms:', req.params.roomId);
        
        db.getRooms(req.params.roomId).then(function (rooms) {
            res.json(rooms);
        }, function (err) {
            res.json({
                error: "Something went wrong"
            });
        });
    });

    module.exports = router;
}());
