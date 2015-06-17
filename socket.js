var socketIO = require('socket.io');
var http = require('http');

// wrap an Express app in a Socket.io server
module.exports = function (app) {
    var server = http.Server(app);
    var io = socketIO(server);
    return {
        server: server,
        io: io
    };
};
