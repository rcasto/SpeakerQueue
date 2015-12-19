(function () {
    "use strict";

    var express = require('express');
    var router = express.Router();

    router.get('/connect', function (req, res) {
        var connectionString = req.headers.host;
        console.log("Connection String:", connectionString);
        res.json({
            connectionString: connectionString
        });
        res.end();
    });

    module.exports = router;
}());
