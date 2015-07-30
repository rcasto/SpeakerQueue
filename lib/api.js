var express = require('express');
var router = express.Router();

router.get('/connect', function (req, res) {
    res.json({
        connectionString: req.headers.host
    });
    res.end();
});

module.exports = router;
