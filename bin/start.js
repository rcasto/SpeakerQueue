var server = require('../server');
var io = require('../socket')(server);

var port = process.env.PORT || 3000;

server.listen(port, function () {
	console.log("Server started on port: " + port);
});

// This is fired whenever a connection is made
io.on('connection', function (socket) {
    socket.join('speakerQueue');
});
