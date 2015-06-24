var Server = require('../server');
var SocketIO = require('../socket')(Server);

var server = SocketIO.server;
var io = SocketIO.io;

var port = process.env.PORT || 3000;

server.listen(port, function () {
	console.log("Server started on port: " + port);
});

// This is fired whenever a connection is made
io.on('connection', function (socket) {
    console.log('Client Connected!');

    // join a room
    socket.join('speakerQueue');

    socket.on('add-song', function (data) {
        console.log('Got the song');
        // Notify other clients
        io.to('speakerQueue').emit('add-song');
    });
});
