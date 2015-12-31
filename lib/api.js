(function () {
    "use strict";

    var express = require('express');
    var fs = require('fs');
    var path = require('path');
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
        console.log('config file requested by a client');

        fs.readFile(path.join(__dirname, '../config.json'), function (err, data) {
            if (err) {
                console.error(JSON.stringify(err));
            }
            res.json(JSON.parse(data));
        });
    });

    module.exports = router;
}());
