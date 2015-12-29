/* global require */
/* global process */

/*
    This file must remain named server.js or Azure will not know what to use for entry point to start
    (This may be able to be changed in a configuration somehow)
    This is what boots up the site and server
*/

(function () {
    "use strict";

    var app = require('./app');
    var server = app.server;
    var port = process.env.PORT || 3000;

    server.listen(port, function () {
        console.log('Server started on port: ' + port);
    });

}());
