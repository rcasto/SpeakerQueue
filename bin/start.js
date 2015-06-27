var app = require('../app');

console.log(JSON.stringify(app));

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

    // register clean up event
    socket.on('disconnect', onDisconnect);
});
