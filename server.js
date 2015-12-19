/* global require */
/* global process */

/*
    This file must remain named server.js or Azure will not know what to use for entry point to start
    
    This is what boots up the site and server
*/

(function () {
    "use strict";

    var app = require('../app');

    var server = app.server;
    var io = app.io;

    var port = process.env.PORT || 3000;

    function onDisconnect() {
        console.log('Client has disconnected');
    }

    server.listen(port, function () {
        console.log('Server started on port: ' + port);
    });

    // This is fired whenever a connection is made
    io.on('connection', function (socket) {
        console.log('Client Connected!');

        // join message room
        socket.join('speakerQueue');

        // register events
        socket.on('disconnect', onDisconnect);
    });

}());
