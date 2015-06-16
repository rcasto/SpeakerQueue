var Server = require('../server');

var server = Server.server;
var io = Server.io;

var port = process.env.PORT || 3000;

server.listen(port, function () {
	console.log("Server started on port: " + port);
});

io.on('connection', function (socket) {
    console.log("Connected!");
});
